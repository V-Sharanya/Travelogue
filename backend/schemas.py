
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
    role: str
    created_at: datetime
    settings: UserSettingsResponse | None = None
    bio: str | None = None
    username: str | None = None

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    name: str | None = None
    bio: str | None = None
    username: str | None = None


class EmailUpdateRequest(BaseModel):
    email: EmailStr


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str


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
    author_name: str | None = None
    author_username: str | None = None

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


class UserSettingsBase(BaseModel):
    public_profile: bool = True
    show_activity_status: bool = True
    show_saved_posts: bool = False
    theme: str = "light"
    reduce_motion: bool = False
    compact_mode: bool = False


class UserSettingsUpdate(BaseModel):
    public_profile: bool | None = None
    show_activity_status: bool | None = None
    show_saved_posts: bool | None = None
    theme: str | None = None
    reduce_motion: bool | None = None
    compact_mode: bool | None = None


class UserSettingsResponse(UserSettingsBase):
    class Config:
        from_attributes = True

