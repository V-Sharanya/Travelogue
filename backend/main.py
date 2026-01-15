import os
os.makedirs("uploads", exist_ok=True)

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
from fastapi.middleware.cors import CORSMiddleware

from fastapi import UploadFile, File, Form
from typing import List

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

import models
import schemas
import crud
from database import engine, get_db
from fastapi.staticfiles import StaticFiles



models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "change-this-later"   # later move to .env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


security = HTTPBearer()



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


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

from jose import JWTError

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
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

    # TEMP: store locally (later replace with Cloudinary)
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

    return post


@app.get("/posts", response_model=list[schemas.PostOut])
def get_all_posts(db: Session = Depends(get_db)):
    return crud.get_all_posts(db)


@app.get("/posts/me", response_model=list[schemas.PostOut])
def get_my_posts(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return crud.get_posts_by_user(db, current_user.id)


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
    return crud.get_saved_posts(db, current_user.id)
