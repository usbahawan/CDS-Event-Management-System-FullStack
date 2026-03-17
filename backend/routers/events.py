from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database import get_db
from models import Event, User, Booking
from schemas import EventCreate, EventResponse
from auth import get_current_user

router = APIRouter(
    prefix="/events",
    tags=["events"],
)

print("DEBUG: EVENTS_ROUTER_LOADED")

@router.post("/", response_model=EventResponse)
async def create_event(
    event: EventCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "organizer":
        raise HTTPException(status_code=403, detail="Not authorized to create events")
    
    event_data = event.model_dump()
    with open("e:/web technologies/backend/debug_events_absolute.log", "a") as f:
        dt = event_data.get('date_time')
        f.write(f"BEFORE: {dt} type={type(dt)} tz={dt.tzinfo}\n")
        
        if dt and dt.tzinfo:
            event_data['date_time'] = dt.replace(tzinfo=None)
            f.write(f"STRIPPING: New={event_data['date_time']} tz={event_data['date_time'].tzinfo}\n")
        else:
            f.write("NO TZ INFO FOUND\n")

    new_event = Event(
        **event_data,
        available_seats=event.total_seats,
        organizer_id=current_user.id
    )
    db.add(new_event)
    await db.commit()
    await db.refresh(new_event)
    return new_event

@router.get("/", response_model=List[EventResponse])
async def read_events(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).offset(skip).limit(limit))
    events = result.scalars().all()
    return events

@router.get("/{event_id}", response_model=EventResponse)
async def read_event(event_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalars().first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: int,
    event_update: EventCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "organizer":
        raise HTTPException(status_code=403, detail="Not authorized to update events")
    
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalars().first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this event")
    
    update_data = event_update.model_dump()
    for key, value in update_data.items():
        if key == 'date_time' and value and value.tzinfo:
            value = value.replace(tzinfo=None)
        setattr(event, key, value)
    
    # Recalculate available seats if total_seats changed (simplified logic)
    # Ideally should check existing bookings
    
    await db.commit()
    await db.refresh(event)
    return event

@router.delete("/{event_id}")
async def delete_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "organizer":
        raise HTTPException(status_code=403, detail="Not authorized to delete events")
    
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalars().first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.organizer_id != current_user.id and current_user.email != "huzaifa.cds@gmail.com":
        raise HTTPException(status_code=403, detail="Not authorized to delete this event")
    
    await db.delete(event)
    await db.commit()
    return {"message": "Event deleted successfully"}

@router.get("/{event_id}/bookings", response_model=List[dict]) # approximate response model for simplicity or use BookingDetailResponse
async def read_event_bookings(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if event exists
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalars().first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    # Authorization: Must be the organizer of the event OR main organizer
    if event.organizer_id != current_user.id and current_user.email != "huzaifa.cds@gmail.com":
        raise HTTPException(status_code=403, detail="Not authorized to view bookings for this event")
    
    # Fetch bookings with user details
    # We need to join Booking and User tables
    # Since models.py definition uses 'bookings' relationship in User and Event, we can access it via lazy loading if async allows,
    # but for async, explicit join is safer/better.
    
    # Import Booking model here to avoid circular depends if any, or just ensure it's imported at top
    from models import Booking
    
    stmt = (
        select(Booking, User)
        .join(User, Booking.user_id == User.id)
        .where(Booking.event_id == event_id)
    )
    result = await db.execute(stmt)
    rows = result.all()
    
    bookings_data = []
    for booking, user in rows:
        bookings_data.append({
            "id": booking.id,
            "event_id": booking.event_id,
            "user_name": user.name,
            "user_email": user.email,
            "seats_booked": booking.seats_booked,
            "booking_time": booking.booking_time,
            "status": booking.status
        })
        
    return bookings_data
