from ml.recommender import recommend_places_for_user

results = recommend_places_for_user(1)

for place, score in results:
    print(place["name"], score)
