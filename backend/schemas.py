from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str
    role: str = "attendee" # or "organizer"

class UserResponse(UserBase):
    id: int
    role: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class EventBase(BaseModel):
    title: str
    description: str
    category: str
    date_time: datetime
    venue: str
    total_seats: int
    price: float

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: int
    organizer_id: int
    available_seats: int
    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    event_id: int
    seats: int

class BookingResponse(BaseModel):
    id: int
    event_id: int
    user_id: int
    seats_booked: int
    booking_time: datetime
    status: str
    class Config:
        from_attributes = True

class BookingDetailResponse(BaseModel):
    id: int
    event_id: int
    user_name: str
    user_email: str
    seats_booked: int
    booking_time: datetime
    status: str
    class Config:
        from_attributes = True
