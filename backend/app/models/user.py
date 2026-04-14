from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    display_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    display_name: str


class UserUpdate(BaseModel):
    display_name: str
