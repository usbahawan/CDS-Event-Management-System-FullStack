from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="attendee") # "organizer" or "attendee"
    
    events = relationship("Event", back_populates="organizer")
    bookings = relationship("Booking", back_populates="user")

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    category = Column(String, index=True)
    date_time = Column(DateTime)
    venue = Column(String)
    total_seats = Column(Integer)
    available_seats = Column(Integer)
    price = Column(Float)
    organizer_id = Column(Integer, ForeignKey("users.id"))
    
    organizer = relationship("User", back_populates="events")
    bookings = relationship("Booking", back_populates="event")

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    seats_booked = Column(Integer)
    booking_time = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="confirmed")
    
    event = relationship("Event", back_populates="bookings")
    user = relationship("User", back_populates="bookings")
