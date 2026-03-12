from pydantic import BaseModel

class UserRegister(BaseModel):
    email: str
    password: str
    display_name: str

class UserLogin(BaseModel):
    email: str
    password: str