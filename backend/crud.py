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
