
from fastapi import FastAPI
from ml.recommender import recommend_places_for_user


from database.db import get_db

app = FastAPI()

@app.get("/")
def root():
    return {"status": "Backend running"}

@app.get("/travelogues/{user_id}")
def get_travelogues(user_id: int):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    query = "SELECT * FROM travelogues WHERE user_id = %s"
    cursor.execute(query, (user_id,))

    result = cursor.fetchall()

    cursor.close()
    db.close()

    return result


@app.get("/recommend/{user_id}")
def recommend(user_id: int):
    results = recommend_places_for_user(user_id)

    return [
        {
            "place_id": r["place"]["id"],
            "place_name": r["place"]["name"],
            "score": float(r["score"]),
            "reason": r["reason"]
        }
        for r in results
    ]
