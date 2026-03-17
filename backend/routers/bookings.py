from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database import get_db
from models import Booking, Event, User
from schemas import BookingCreate, BookingResponse
from auth import get_current_user

router = APIRouter(
    prefix="/bookings",
    tags=["bookings"],
)

@router.post("/", response_model=BookingResponse)
async def create_booking(
    booking: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Event).where(Event.id == booking.event_id))
    event = result.scalars().first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.available_seats < booking.seats:
        raise HTTPException(status_code=400, detail="Not enough seats available")
    
    new_booking = Booking(
        event_id=booking.event_id,
        user_id=current_user.id,
        seats_booked=booking.seats,
        status="confirmed"
    )
    
    event.available_seats -= booking.seats
    
    db.add(new_booking)
    await db.commit()
    await db.refresh(new_booking)
    return new_booking

@router.get("/", response_model=List[BookingResponse])
async def read_bookings(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Booking).where(Booking.user_id == current_user.id))
    bookings = result.scalars().all()
    return bookings

@router.delete("/{booking_id}")
async def cancel_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalars().first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")
    
    # Restore seats
    result = await db.execute(select(Event).where(Event.id == booking.event_id))
    event = result.scalars().first()
    if event:
        event.available_seats += booking.seats_booked
    
    await db.delete(booking)
    await db.commit()
    return {"message": "Booking cancelled successfully"}
