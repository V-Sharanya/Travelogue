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


from sqlalchemy import Text, ForeignKey
from sqlalchemy.orm import relationship

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    location = Column(String(150))

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    user = relationship("User")

from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class PostImage(Base):
    __tablename__ = "post_images"

    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"))
    image_url = Column(String(500), nullable=False)

    post = relationship("Post", backref="images")


class PostLike(Base):
    __tablename__ = "post_likes"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"))
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User")
    post = relationship("Post")


class PostSave(Base):
    __tablename__ = "post_saves"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"))
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User")
    post = relationship("Post")
