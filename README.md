# Travelogue-Based Recommendation System

This project is a web-based travel recommendation system that uses user-written travelogues to generate personalized and explainable travel place recommendations.

Unlike traditional travel applications that provide generic suggestions, this system analyzes unstructured travelogue text to infer user preferences and recommend places accordingly.

---

## Problem Statement

Most existing travel platforms rely on ratings or predefined preferences, ignoring rich user-generated content such as travel stories and experiences. As a result, recommendations often lack personalization and transparency.

This project aims to bridge that gap by leveraging travelogues to:
- Understand user interests
- Recommend relevant travel destinations
- Provide explanations for each recommendation

---

## Key Features

- Create and store user travelogues
- Content-based travel recommendation using NLP
- Explainable recommendations (why a place is suggested)
- RESTful API built with FastAPI
- MySQL database backend
- Environment-safe configuration using `.env`

---

## Tech Stack

- **Backend:** FastAPI (Python)
- **Database:** MySQL
- **NLP / ML:** scikit-learn (TF-IDF, cosine similarity)
- **API Server:** Uvicorn

---

## Project Structure

backend/
├── main.py
├── ml/
│ └── recommender.py
├── database/
│ └── db.py
├── .env
├── requirements.txt
└── venv/


---

## How It Works

1. User writes travelogues describing past trips
2. Travelogue text is processed using NLP techniques
3. User preferences are inferred from frequent keywords
4. Places are ranked using cosine similarity
5. Each recommendation includes an explanation

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repo-url>
cd backend
