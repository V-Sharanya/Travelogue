"""
Recommendation engine: content-based semantic similarity + behavioral weighting.

Uses:
- Saved destinations (saved posts) — weighted 2x
- Liked posts — weighted 1x
- Tags & descriptions (title, content, location) — bag-of-words cosine similarity
- Behavioral: boost posts from authors the user has saved/liked before

Optional future: search queries, interaction time (e.g. weight recent saves/likes).
"""
import re
from collections import Counter
import math


def _tokenize(text: str) -> list[str]:
    """Lowercase words, strip non-alphanumeric."""
    if not text:
        return []
    text = (text or "").lower()
    words = re.findall(r"[a-z0-9]+", text)
    return [w for w in words if len(w) > 1]


def _post_text(post) -> str:
    """Concatenate title, content, location for semantic bag-of-words."""
    parts = []
    if getattr(post, "title", None):
        parts.append(post.title)
    if getattr(post, "content", None):
        parts.append(post.content)
    if getattr(post, "location", None):
        parts.append(post.location)
    return " ".join(parts)


def _cosine_similarity(counter_a: Counter, counter_b: Counter) -> float:
    """Cosine similarity between two word-count vectors. Returns 0 if either is empty."""
    if not counter_a or not counter_b:
        return 0.0
    dot = sum(counter_a[w] * counter_b[w] for w in counter_a if w in counter_b)
    norm_a = math.sqrt(sum(c * c for c in counter_a.values()))
    norm_b = math.sqrt(sum(c * c for c in counter_b.values()))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def build_user_profile(saved_posts: list, liked_posts: list) -> tuple[Counter, set]:
    """
    Build preference profile from saved (weight 2) and liked (weight 1) posts.
    Returns (word_counter, set of preferred author user_ids).
    """
    profile = Counter()
    preferred_authors = set()
    for post in saved_posts:
        for word in _tokenize(_post_text(post)):
            profile[word] += 2
        if getattr(post, "user_id", None):
            preferred_authors.add(post.user_id)
    for post in liked_posts:
        for word in _tokenize(_post_text(post)):
            profile[word] += 1
        if getattr(post, "user_id", None):
            preferred_authors.add(post.user_id)
    return profile, preferred_authors


def score_post(
    post,
    profile_counter: Counter,
    preferred_authors: set,
    *,
    content_weight: float = 0.7,
    behavior_weight: float = 0.3,
) -> float:
    """
    Combined score: content-based similarity + behavioral (same author as saved/liked).
    """
    post_words = Counter(_tokenize(_post_text(post)))
    content_score = _cosine_similarity(profile_counter, post_words)
    # Behavioral: boost if this post is from an author the user has saved/liked before
    author_id = getattr(post, "user_id", None)
    behavior_score = 1.0 if author_id in preferred_authors else 0.0
    return content_weight * content_score + behavior_weight * behavior_score


def rank_candidates(candidates: list, profile_counter: Counter, preferred_authors: set) -> list:
    """Sort candidates by combined score descending."""
    scored = [
        (p, score_post(p, profile_counter, preferred_authors))
        for p in candidates
    ]
    scored.sort(key=lambda x: x[1], reverse=True)
    return [p for p, _ in scored]
