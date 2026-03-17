from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, events, bookings
import models

import os
print(f"STARTUP_CHECK: Running main.py from {os.getcwd()}")
print(f"STARTUP_CHECK: File Location: {__file__}")

app = FastAPI(title="CDS Event Management System")

# CORS
origins = [
    "http://localhost:5173",  # React default port
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to simple init db tables if not exist
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


from fastapi import Request
from fastapi.responses import JSONResponse
import traceback

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_msg = "".join(traceback.format_exception(None, exc, exc.__traceback__))
    with open("error.log", "a") as f:
        f.write(f"ERROR: {exc}\n{error_msg}\n")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc), "trace": error_msg},
    )

app.include_router(auth.router)

app.include_router(events.router)
app.include_router(bookings.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to CDS Event Management API"}
