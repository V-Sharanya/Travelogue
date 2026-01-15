from sqlalchemy.orm import Session
from passlib.context import CryptContext
import models, schemas

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = hash_password(user.password)

    db_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password
    )

    from sqlalchemy.exc import IntegrityError

    db.add(db_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        return None

    db.refresh(db_user)
    return db_user



def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def update_user(db: Session, user_id: int, user_data: schemas.UserUpdate):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return None

    if user_data.name is not None:
        user.name = user_data.name
    if user_data.email is not None:
        user.email = user_data.email

    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return None

    db.delete(user)
    db.commit()
    return user


def get_all_users(db: Session):
    return db.query(models.User).all()

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user


# -------- PLACE CRUD --------

def create_place(db: Session, place: schemas.PlaceCreate):
    db_place = models.Place(**place.dict())
    db.add(db_place)
    db.commit()
    db.refresh(db_place)
    return db_place


def get_all_places(db: Session, only_active: bool = True):
    query = db.query(models.Place)
    if only_active:
        query = query.filter(models.Place.is_active == True)
    return query.all()


def get_place_by_id(db: Session, place_id: int):
    return db.query(models.Place).filter(models.Place.id == place_id).first()


def update_place(db: Session, place_id: int, data: schemas.PlaceUpdate):
    place = get_place_by_id(db, place_id)
    if not place:
        return None

    for key, value in data.dict(exclude_unset=True).items():
        setattr(place, key, value)

    db.commit()
    db.refresh(place)
    return place


# -------- POST CRUD --------



def get_all_posts(db: Session):
    return db.query(models.Post).order_by(models.Post.created_at.desc()).all()


def get_post_by_id(db: Session, post_id: int):
    return db.query(models.Post).filter(models.Post.id == post_id).first()


def get_posts_by_user(db: Session, user_id: int):
    return db.query(models.Post).filter(models.Post.user_id == user_id).all()


def delete_post(db: Session, post_id: int, user_id: int):
    post = get_post_by_id(db, post_id)

    if not post or post.user_id != user_id:
        return None

    db.delete(post)
    db.commit()
    return post

def like_post(db: Session, user_id: int, post_id: int):
    existing = db.query(models.PostLike).filter_by(
        user_id=user_id, post_id=post_id
    ).first()

    if existing:
        return False

    db.add(models.PostLike(user_id=user_id, post_id=post_id))
    db.commit()
    return True

def unlike_post(db: Session, user_id: int, post_id: int):
    like = db.query(models.PostLike).filter_by(
        user_id=user_id, post_id=post_id
    ).first()

    if not like:
        return False

    db.delete(like)
    db.commit()
    return True

def get_like_count(db: Session, post_id: int):
    return db.query(models.PostLike).filter_by(post_id=post_id).count()

def save_post(db: Session, user_id: int, post_id: int):
    existing = db.query(models.PostSave).filter_by(
        user_id=user_id, post_id=post_id
    ).first()

    if existing:
        return False

    db.add(models.PostSave(user_id=user_id, post_id=post_id))
    db.commit()
    return True

def unsave_post(db: Session, user_id: int, post_id: int):
    save = db.query(models.PostSave).filter_by(
        user_id=user_id, post_id=post_id
    ).first()

    if not save:
        return False

    db.delete(save)
    db.commit()
    return True

def get_saved_posts(db: Session, user_id: int):
    return (
        db.query(models.Post)
        .join(models.PostSave, models.Post.id == models.PostSave.post_id)
        .filter(models.PostSave.user_id == user_id)
        .order_by(models.PostSave.created_at.desc())
        .all()
    )

from sqlalchemy import func, exists

def get_feed_posts(db: Session, user_id: int):
    like_count_subq = (
        db.query(
            models.PostLike.post_id,
            func.count(models.PostLike.id).label("like_count")
        )
        .group_by(models.PostLike.post_id)
        .subquery()
    )

    posts = (
        db.query(
            models.Post,
            func.coalesce(like_count_subq.c.like_count, 0).label("like_count"),
            exists().where(
                (models.PostLike.post_id == models.Post.id) &
                (models.PostLike.user_id == user_id)
            ).label("liked"),
            exists().where(
                (models.PostSave.post_id == models.Post.id) &
                (models.PostSave.user_id == user_id)
            ).label("saved")
        )
        .outerjoin(like_count_subq, models.Post.id == like_count_subq.c.post_id)
        .order_by(models.Post.created_at.desc())
        .all()
    )

    return posts
