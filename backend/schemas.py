
from pydantic import BaseModel, EmailStr
from datetime import datetime

# -------- INPUT SCHEMAS --------

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None


# -------- OUTPUT SCHEMA --------

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str            # 🔑 ADD THIS
    created_at: datetime

    class Config:
        from_attributes = True



class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    message: str
    user_id: int

class Token(BaseModel):
    access_token: str
    token_type: str


# -------- PLACE SCHEMAS --------

class PlaceBase(BaseModel):
    name: str
    country: str
    state: str | None = None
    category: str | None = None
    latitude: float | None = None
    longitude: float | None = None


class PlaceCreate(PlaceBase):
    pass


class PlaceUpdate(BaseModel):
    name: str | None = None
    country: str | None = None
    state: str | None = None
    category: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    is_active: bool | None = None


class PlaceOut(PlaceBase):
    id: int
    popularity_score: int
    is_active: bool

    class Config:
        from_attributes = True


# -------- POST SCHEMAS --------



class PostUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    location: str | None = None


# -------- POST IMAGE --------
# -------- POST SCHEMAS --------

class PostImageOut(BaseModel):
    image_url: str

    class Config:
        from_attributes = True


class PostOut(BaseModel):
    id: int
    user_id: int
    title: str
    content: str
    location: str | None
    created_at: datetime
    images: list[PostImageOut] = []

    like_count: int
    liked: bool
    saved: bool

    class Config:
        from_attributes = True

class LikeResponse(BaseModel):
    liked: bool
    like_count: int


class SaveResponse(BaseModel):
    saved: bool
