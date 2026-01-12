
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
