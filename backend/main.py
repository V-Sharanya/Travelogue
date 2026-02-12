import os
os.makedirs("uploads", exist_ok=True)

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
from fastapi.middleware.cors import CORSMiddleware

from fastapi import UploadFile, File, Form, Body
from typing import List

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

import models
import schemas
import crud
import recommendations
from database import engine, get_db
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

models.Base.metadata.create_all(bind=engine)

# Add new user columns if missing (e.g. bio, username)
try:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN bio VARCHAR(500) NULL"))
        conn.execute(text("ALTER TABLE users ADD COLUMN username VARCHAR(50) NULL"))
        conn.commit()
except Exception:
    pass  # columns already exist

app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
],
  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "change-this-later"   # later move to .env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

security = HTTPBearer(auto_error=False)

from jose import JWTError


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = crud.get_user_by_id(db, int(user_id))
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@app.post("/users", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    created_user = crud.create_user(db, user)
    if not created_user:
        raise HTTPException(status_code=409, detail="Email already registered")
    return created_user


@app.get("/users", response_model=list[schemas.UserOut])
def get_users(db: Session = Depends(get_db)):
    return crud.get_all_users(db)

@app.get("/users/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.put("/users/email")
def update_email(
    payload: schemas.EmailUpdateRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    from sqlalchemy.exc import IntegrityError
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing and existing.id != current_user.id:
        raise HTTPException(status_code=409, detail="Email already registered")
    current_user.email = payload.email
    db.commit()
    db.refresh(current_user)
    return {"message": "Email updated"}


@app.put("/users/password")
def change_password(
    payload: schemas.PasswordChangeRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not crud.verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect password")
    current_user.password_hash = crud.hash_password(payload.new_password)
    db.commit()
    return {"message": "Password updated"}


@app.delete("/users")
def delete_account(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db.delete(current_user)
    db.commit()
    return {"message": "Account deleted"}


@app.put("/users/me", response_model=schemas.UserOut)
def update_my_profile(
    payload: schemas.ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    from sqlalchemy.exc import IntegrityError
    if payload.name is not None:
        current_user.name = payload.name
    if payload.bio is not None:
        current_user.bio = payload.bio
    if payload.username is not None:
        existing = db.query(models.User).filter(models.User.username == payload.username).first()
        if existing and existing.id != current_user.id:
            raise HTTPException(status_code=409, detail="Username already taken")
        current_user.username = payload.username
    db.commit()
    db.refresh(current_user)
    return current_user


@app.put("/users/{user_id}", response_model=schemas.UserOut)
def update_user(
    user_id: int,
    user_data: schemas.UserUpdate,
    db: Session = Depends(get_db)
):
    user = crud.update_user(db, user_id, user_data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.delete_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@app.post("/auth/login", response_model=schemas.Token)
def login(
    credentials: schemas.LoginRequest,
    db: Session = Depends(get_db)
):
    user = crud.authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@app.get("/auth/me", response_model=schemas.UserOut)
def read_current_user(current_user = Depends(get_current_user)):
    return current_user

def get_current_admin(
    current_user = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# -------- ADMIN PLACES --------

@app.post("/admin/places", response_model=schemas.PlaceOut)
def admin_create_place(
    place: schemas.PlaceCreate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    return crud.create_place(db, place)


@app.put("/admin/places/{place_id}", response_model=schemas.PlaceOut)
def admin_update_place(
    place_id: int,
    data: schemas.PlaceUpdate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    place = crud.update_place(db, place_id, data)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    return place

# -------- PUBLIC PLACES --------

@app.get("/places", response_model=list[schemas.PlaceOut])
def get_places(db: Session = Depends(get_db)):
    return crud.get_all_places(db)


@app.get("/places/{place_id}", response_model=schemas.PlaceOut)
def get_place(place_id: int, db: Session = Depends(get_db)):
    place = crud.get_place_by_id(db, place_id)
    if not place or not place.is_active:
        raise HTTPException(status_code=404, detail="Place not found")
    return place

@app.delete("/admin/places/{place_id}")
def admin_delete_place(
    place_id: int,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    place = crud.get_place_by_id(db, place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")

    db.delete(place)
    db.commit()
    return {"message": "Place deleted successfully"}


# -------- USER POSTS --------
@app.post("/posts", response_model=schemas.PostOut)
def create_post(
    title: str = Form(...),
    content: str = Form(...),
    location: str | None = Form(None),
    images: List[UploadFile] = File([]),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    post = models.Post(
        user_id=current_user.id,
        title=title,
        content=content,
        location=location,
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    for img in images:
        file_path = f"uploads/{post.id}_{img.filename}"
        with open(file_path, "wb") as f:
            f.write(img.file.read())

        db.add(models.PostImage(
            post_id=post.id,
            image_url=file_path
        ))

    db.commit()
    db.refresh(post)

    post.like_count = 0
    post.liked = False
    post.saved = False
    post.author_name = current_user.name
    post.author_username = getattr(current_user, "username", None)

    return post

@app.get("/posts", response_model=list[schemas.PostOut])
def get_feed(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    results = crud.get_feed_posts(db, current_user.id)

    feed = []
    for post, like_count, liked, saved in results:
        post.like_count = like_count
        post.liked = liked
        post.saved = saved
        post.author_name = post.user.name if post.user else None
        post.author_username = getattr(post.user, "username", None) if post.user else None
        feed.append(post)

    return feed


@app.get("/posts/recommendations", response_model=list[schemas.PostOut])
def get_recommendations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Recommend next travel destinations using:
    - Saved posts & liked posts (behavioral)
    - Content/tags/descriptions (title, content, location) for semantic similarity.
    """
    saved_posts = crud.get_saved_posts(db, current_user.id)
    liked_posts = crud.get_liked_posts(db, current_user.id)
    results = crud.get_feed_posts(db, current_user.id)

    # Exclude own posts from candidates
    candidate_tuples = [
        (post, like_count, liked, saved)
        for post, like_count, liked, saved in results
        if post.user_id != current_user.id
    ]
    if not candidate_tuples:
        return []

    profile_counter, preferred_authors = recommendations.build_user_profile(
        saved_posts, liked_posts
    )

    # Map post.id -> (like_count, liked, saved) for decorating the response payload
    post_to_meta = {
        p.id: (lc, liked, saved)
        for p, lc, liked, saved in candidate_tuples
    }

    # If we have behavioral history, use the AI-powered recommender + explanations.
    if profile_counter or preferred_authors:
        rec_items = recommendations.recommend_posts_ai(
            candidates=[p for p, _, _, _ in candidate_tuples],
            saved_posts=saved_posts,
            liked_posts=liked_posts,
            top_k=30,
        )

        feed: list[models.Post] = []
        for item in rec_items:
            post = item["post"]
            reason = item.get("reason")
            lc, liked, saved = post_to_meta.get(
                post.id, (getattr(post, "like_count", 0), False, False)
            )
            post.like_count = lc
            post.liked = liked
            post.saved = saved
            post.author_name = post.user.name if post.user else None
            post.author_username = getattr(post.user, "username", None) if post.user else None
            # Attach explanation for frontend
            post.recommendation_reason = reason
            feed.append(post)
        return feed

    # No saved/liked yet: fall back to popularity (like_count) without explanations
    ranked = [
        p for p, _, _, _ in sorted(
            candidate_tuples, key=lambda x: x[1], reverse=True
        )
    ]
    feed: list[models.Post] = []
    for post in ranked:
        lc, liked, saved = post_to_meta.get(
            post.id, (getattr(post, "like_count", 0), False, False)
        )
        post.like_count = lc
        post.liked = liked
        post.saved = saved
        post.author_name = post.user.name if post.user else None
        post.author_username = getattr(post.user, "username", None) if post.user else None
        feed.append(post)
    return feed


@app.get("/posts/me", response_model=list[schemas.PostOut])
def get_my_posts(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    posts = crud.get_posts_by_user(db, current_user.id)

    feed = []
    for post in posts:
        post.like_count = crud.get_like_count(db, post.id)
        post.liked = (
            db.query(models.PostLike)
            .filter_by(user_id=current_user.id, post_id=post.id)
            .first()
            is not None
        )
        post.saved = (
            db.query(models.PostSave)
            .filter_by(user_id=current_user.id, post_id=post.id)
            .first()
            is not None
        )
        post.author_name = post.user.name if post.user else None
        post.author_username = getattr(post.user, "username", None) if post.user else None
        feed.append(post)

    return feed

@app.delete("/posts/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    post = crud.delete_post(db, post_id, current_user.id)
    if not post:
        raise HTTPException(status_code=403, detail="Not authorized")
    return {"message": "Post deleted successfully"}

@app.post("/posts/{post_id}/like", response_model=schemas.LikeResponse)
def like_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    liked = crud.like_post(db, current_user.id, post_id)
    count = crud.get_like_count(db, post_id)
    return {"liked": liked, "like_count": count}


@app.delete("/posts/{post_id}/like", response_model=schemas.LikeResponse)
def unlike_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    crud.unlike_post(db, current_user.id, post_id)
    count = crud.get_like_count(db, post_id)
    return {"liked": False, "like_count": count}

@app.post("/posts/{post_id}/save", response_model=schemas.SaveResponse)
def save_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    saved = crud.save_post(db, current_user.id, post_id)
    return {"saved": saved}


@app.delete("/posts/{post_id}/save", response_model=schemas.SaveResponse)
def unsave_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    crud.unsave_post(db, current_user.id, post_id)
    return {"saved": False}

@app.get("/posts/saved", response_model=list[schemas.PostOut])
def my_saved_posts(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    posts = crud.get_saved_posts(db, current_user.id)

    feed = []
    for post in posts:
        post.like_count = crud.get_like_count(db, post.id)
        post.liked = (
            db.query(models.PostLike)
            .filter_by(user_id=current_user.id, post_id=post.id)
            .first()
            is not None
        )
        post.saved = True
        post.author_name = post.user.name if post.user else None
        post.author_username = getattr(post.user, "username", None) if post.user else None
        feed.append(post)

    return feed


# -------- TRIP PLANNER --------


@app.post("/trip-plan", response_model=schemas.TripPlanResponse)
def create_trip_plan(
    payload: schemas.TripPlanRequest = Body(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Small 'TripAdvisor' style helper.

    Builds a simple multi-day itinerary for a destination by:
    - Using the user's recommendation profile (saved + liked posts).
    - Focusing on posts that match the requested destination in their `location` or text.
    - Distributing the best matches across the requested days.
    """
    destination = payload.destination.strip()
    days = max(1, min(payload.days, 7))

    # Get recommendation context
    saved_posts = crud.get_saved_posts(db, current_user.id)
    liked_posts = crud.get_liked_posts(db, current_user.id)
    results = crud.get_feed_posts(db, current_user.id)

    # Build candidates restricted to the destination and excluding own posts
    dest_lower = destination.lower()
    candidate_posts: list[models.Post] = []
    for post, like_count, liked, saved in results:
        if post.user_id == current_user.id:
            continue
        text = " ".join(
            [
                getattr(post, "title", "") or "",
                getattr(post, "content", "") or "",
                getattr(post, "location", "") or "",
            ]
        ).lower()
        if dest_lower not in text:
            continue
        candidate_posts.append(post)

    # If nothing matches the destination, fall back to normal recommendations.
    if not candidate_posts:
        rec_items = recommendations.recommend_posts_ai(
            candidates=[p for p, _, _, _ in results if p.user_id != current_user.id],
            saved_posts=saved_posts,
            liked_posts=liked_posts,
            top_k=days * 3,
        )
    else:
        rec_items = recommendations.recommend_posts_ai(
            candidates=candidate_posts,
            saved_posts=saved_posts,
            liked_posts=liked_posts,
            top_k=days * 3,
        )

    # Distribute activities across days (2–3 per day depending on how many we have)
    activities_per_day = max(1, min(3, (len(rec_items) // days) or 1))

    days_plan: list[schemas.TripDay] = []
    idx = 0
    for day_num in range(1, days + 1):
        day_activities: list[schemas.TripActivity] = []
        for _ in range(activities_per_day):
            if idx >= len(rec_items):
                break
            item = rec_items[idx]
            post = item["post"]
            reason = item.get("reason") or ""
            day_activities.append(
                schemas.TripActivity(
                    title=post.title,
                    description=reason or (post.content[:160] + "..." if post.content else ""),
                    source_post_id=post.id,
                )
            )
            idx += 1

        if not day_activities:
            break

        summary = f"Day {day_num} around {destination} with {len(day_activities)} key stops."
        days_plan.append(
            schemas.TripDay(
                day=day_num,
                summary=summary,
                activities=day_activities,
            )
        )

    return schemas.TripPlanResponse(
        destination=destination,
        days=days,
        style=payload.style,
        days_plan=days_plan,
    )

@app.get("/settings", response_model=schemas.UserSettingsResponse)
def read_settings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    settings = crud.get_user_settings(db, current_user.id)

    if not settings:
        settings = crud.create_default_settings(db, current_user.id)

    return settings


@app.put("/settings", response_model=schemas.UserSettingsResponse)
def update_settings(
    payload: schemas.UserSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.update_user_settings(db, current_user.id, payload)

