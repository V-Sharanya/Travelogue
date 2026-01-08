from fastapi import FastAPI
from app.database import Base, engine
from app.routes import auth, places

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Travelogue Backend")

app.include_router(auth.router)
app.include_router(places.router)

@app.get("/")
def health():
    return {"status": "Backend running"}
