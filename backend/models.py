from sqlalchemy import DECIMAL, Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String(255))
    role = Column(String(20), default="user")
    created_at = Column(DateTime, server_default=func.now())


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    country = Column(String(100), nullable=False)
    state = Column(String(100))
    category = Column(String(50))
    latitude = Column(DECIMAL(10, 8))
    longitude = Column(DECIMAL(11, 8))
    popularity_score = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
