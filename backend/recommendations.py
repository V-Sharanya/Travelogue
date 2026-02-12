"""
Recommendation engine.

Current capabilities:
- Traditional content-based similarity: bag-of-words cosine similarity over title/content/location.
- Behavioral signal: boost posts from authors the user has saved/liked before.
- AI model–powered ranking (optional): sentence-transformer embeddings when the dependency is installed.
- Human-readable explanations for why a post was recommended.

Signals used:
- Saved destinations (saved posts) — weighted 2x
- Liked posts — weighted 1x
- Tags & descriptions (title, content, location)
- Preferred authors (based on saved/liked history)

Optional future: search queries, interaction time (e.g. weight recent saves/likes), trip constraints.
"""
import re
from collections import Counter
import math

try:  # Optional, only used if installed
    from sentence_transformers import SentenceTransformer  # type: ignore
    import numpy as np  # type: ignore
except ImportError:  # pragma: no cover - soft dependency
    SentenceTransformer = None  # type: ignore
    np = None  # type: ignore


_EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
_embedding_model = None


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


def _get_embedding_model():
    """
    Lazy-load the sentence-transformer model.

    If the dependency is not installed, callers should catch RuntimeError and fall back.
    """
    global _embedding_model
    if SentenceTransformer is None:
        raise RuntimeError(
            "sentence-transformers is not installed. Install it with 'pip install sentence-transformers'."
        )
    if _embedding_model is None:
        _embedding_model = SentenceTransformer(_EMBEDDING_MODEL_NAME)
    return _embedding_model


def _encode_text_embedding(text: str):
    """Encode arbitrary text into a normalized embedding vector."""
    if np is None:
        raise RuntimeError("NumPy is not available for embeddings.")
    model = _get_embedding_model()
    # Returns a 1D numpy array
    return model.encode(text or "", normalize_embeddings=True)


def build_user_embedding(saved_posts: list, liked_posts: list):
    """
    Build a user preference embedding using a weighted average of post embeddings.

    Saved posts are weighted 2x, liked posts 1x to mirror the word-profile logic.
    Returns a normalized numpy vector or None if no behavioral history / embeddings unavailable.
    """
    if np is None or SentenceTransformer is None:
        return None

    texts: list[str] = []
    weights: list[float] = []

    for post in saved_posts:
        texts.append(_post_text(post))
        weights.append(2.0)
    for post in liked_posts:
        texts.append(_post_text(post))
        weights.append(1.0)

    if not texts:
        return None

    model = _get_embedding_model()
    embeddings = model.encode(texts, normalize_embeddings=True)
    weights_arr = np.asarray(weights, dtype="float32")[:, None]
    weighted = (embeddings * weights_arr).sum(axis=0)
    norm = float(np.linalg.norm(weighted))
    if norm == 0.0:
        return None
    return weighted / norm


def score_post_embedding(post, user_embedding) -> float:
    """
    Score a post using cosine similarity between its embedding and the user embedding.
    """
    if user_embedding is None or np is None or SentenceTransformer is None:
        return 0.0

    post_emb = _encode_text_embedding(_post_text(post))
    # user_embedding is already normalized; _encode_text_embedding normalizes post_emb.
    return float(np.dot(user_embedding, post_emb))


def explain_recommendation(
    post,
    profile_counter: Counter,
    preferred_authors: set,
    saved_ids: set,
    liked_ids: set,
    *,
    rank: int | None = None,
    max_keywords: int = 3,
) -> str:
    """
    Create a human-readable explanation for why a post was recommended.

    This uses simple, transparent signals:
    - Overlap between the user's word-profile and the post.
    - Whether the author is someone the user has engaged with before.
    """
    post_words = Counter(_tokenize(_post_text(post)))

    # Find overlapping keywords, ordered by how strong they are in the user profile.
    common = [w for w in profile_counter if w in post_words]
    common.sort(key=lambda w: profile_counter[w], reverse=True)
    top = common[:max_keywords]

    detail_parts: list[str] = []

    # Direct interactions with this exact post
    if getattr(post, "id", None) in saved_ids:
        detail_parts.append("you saved this destination earlier")
    elif getattr(post, "id", None) in liked_ids:
        detail_parts.append("you liked this trip before")

    # Topic-level similarity
    if top:
        detail_parts.append("it matches your interests around: " + ", ".join(top))

    # Author affinity
    author_id = getattr(post, "user_id", None)
    if author_id in preferred_authors:
        detail_parts.append("it's from a traveler whose posts you engage with")

    if rank is not None and rank == 1:
        lead = "Top pick for you"
    elif rank is not None and rank in (2, 3):
        lead = f"High-ranked recommendation #{rank}"
    elif rank is not None:
        lead = f"Recommendation #{rank}"
    else:
        lead = "Recommended for you"

    if not detail_parts:
        return f"{lead} based on your recent activity."

    explanation = f"{lead} because " + "; ".join(detail_parts)
    return explanation


def recommend_posts_ai(
    candidates: list,
    saved_posts: list,
    liked_posts: list,
    *,
    top_k: int | None = None,
) -> list[dict]:
    """
    AI-powered recommendation entrypoint.

    - Uses sentence-transformer embeddings when available for semantic similarity.
    - Falls back to the existing bag-of-words + behavioral scoring when embeddings are unavailable.
    - Always attaches a simple textual explanation per recommendation.

    Returns a list of dicts: { "post": post, "score": float, "reason": str } sorted by score desc.
    """
    profile_counter, preferred_authors = build_user_profile(saved_posts, liked_posts)

    # Try to build an embedding-based profile; if that fails, we silently fall back.
    try:
        user_embedding = build_user_embedding(saved_posts, liked_posts)
    except RuntimeError:
        user_embedding = None

    saved_ids = {getattr(p, "id", None) for p in saved_posts}
    liked_ids = {getattr(p, "id", None) for p in liked_posts}

    scored: list[dict] = []
    for post in candidates:
        if user_embedding is not None:
            # Primary: embedding-based semantic similarity, plus a small behavioral boost.
            content_score = score_post_embedding(post, user_embedding)
            author_id = getattr(post, "user_id", None)
            behavior_score = 1.0 if author_id in preferred_authors else 0.0
            score = 0.8 * content_score + 0.2 * behavior_score
        else:
            # Fallback: purely traditional scoring.
            score = score_post(post, profile_counter, preferred_authors)

        scored.append(
            {
                "post": post,
                "score": float(score),
            }
        )

    # Sort by score descending
    scored.sort(key=lambda item: item["score"], reverse=True)

    # Prefer items with a positive score; if all are <= 0, keep the original order.
    positive_scored = [item for item in scored if item["score"] > 0]
    if positive_scored:
        scored = positive_scored

    if top_k is not None:
        scored = scored[:top_k]

    # Attach human-readable reasons after final ranking so rank is meaningful.
    with_reasons: list[dict] = []
    for idx, item in enumerate(scored, start=1):
        post = item["post"]
        reason = explain_recommendation(
            post,
            profile_counter,
            preferred_authors,
            saved_ids,
            liked_ids,
            rank=idx,
        )
        with_reasons.append(
            {
                "post": post,
                "score": float(item["score"]),
                "reason": reason,
            }
        )

    return with_reasons
