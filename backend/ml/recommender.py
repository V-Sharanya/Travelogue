import os
import mysql.connector
from dotenv import load_dotenv
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from collections import Counter
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
import re

load_dotenv()

def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

def extract_top_keywords(text, top_n=5):
    words = text.lower().split()
    common_words = Counter(words)
    return [word for word, _ in common_words.most_common(top_n)]


def recommend_places_for_user(user_id, top_n=5):
    db = get_connection()
    cursor = db.cursor(dictionary=True)

    # Fetch travelogues
    cursor.execute(
        "SELECT text FROM travelogues WHERE user_id = %s",
        (user_id,)
    )
    rows = cursor.fetchall()

    if not rows:
        return []

    user_text = " ".join(r["text"] for r in rows)

    # Fetch places
    cursor.execute("SELECT id, name, description FROM places")
    places = cursor.fetchall()

    place_texts = [p["description"] for p in places]

    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([user_text] + place_texts)

    scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    ranked = sorted(
        zip(places, scores),
        key=lambda x: x[1],
        reverse=True
    )

    cursor.close()
    db.close()

    keywords = extract_top_keywords(user_text)

    results = []
    for place, score in ranked[:top_n]:
        matched = [kw for kw in keywords if kw in place["description"].lower()]
        explanation = (
            f"Recommended because you often mention {', '.join(matched)}"
            if matched else
            "Recommended based on your travel preferences"
        )

        results.append({
            "place": place,
            "score": score,
            "reason": explanation
        })
    return results

        
def extract_top_keywords(text, top_n=5):
    # lowercase and remove punctuation
    words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())

    # remove stopwords
    meaningful_words = [
        w for w in words if w not in ENGLISH_STOP_WORDS
    ]

    counts = Counter(meaningful_words)
    return [word for word, _ in counts.most_common(top_n)]