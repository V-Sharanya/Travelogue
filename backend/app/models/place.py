from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150))
    description = Column(Text)
    location = Column(String(100))
    category = Column(String(50))
    created_at = Column(DateTime, server_default=func.now())
