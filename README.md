# CDS Event Management System

A premium, full-stack event management platform designed for organizing, discovering, and booking exclusive events, concerts, and conferences.

## 🚀 Overview

The CDS Event Management System provides a seamless experience for both event organizers and attendees. Organizers can create and manage events, while attendees can browse upcoming events and book tickets easily through a modern, responsive interface.

## 🛠️ Technology Stack

### Frontend
- **React 19**: Modern UI library for building dynamic interfaces.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS 4**: Utility-first CSS framework for high-performance styling.
- **React Router 7**: Declarative routing for navigation.
- **Axios**: Promised-based HTTP client for API interactions.

### Backend
- **FastAPI**: High-performance Python framework for building APIs.
- **SQLAlchemy**: SQL toolkit and ORM for database management.
- **PostgreSQL**: Robust relational database (via `asyncpg`).
- **Pydantic**: Data validation and settings management.
- **JWT (JSON Web Tokens)**: Secure authentication and authorization.

## ✨ Features

- **User Authentication**: Secure Login and Registration with role-based access (Organizer/Attendee).
- **Organizer Dashboard**: Create, view, and delete events with real-time capacity tracking.
- **Event Discovery**: Browse upcoming events with search and category filtering.
- **Booking System**: Seamless ticket booking for attendees.
- **My Tickets**: Personalized dashboard for users to manage their bookings.
- **Responsive Design**: Glassmorphism-inspired UI that works beautifully on all devices.

## 📂 Project Structure

```bash
web-technologies/
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Main application pages
│   │   ├── context/      # Auth and API contexts
│   │   └── App.jsx       # Root component and routing
├── backend/              # FastAPI application
│   ├── routers/          # API route handlers
│   ├── models.py         # Database models
│   ├── schemas.py        # Pydantic validation schemas
│   └── main.py           # Application entry point
```

## ⚙️ Setup & Installation

### Backend
1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv venv`.
3. Activate the environment:
   - Windows: `venv\Scripts\activate`
   - Linux/macOS: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`.
5. Configure your `.env` file with database credentials.
6. Run the server: `uvicorn main:app --reload`.

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Run the development server: `npm run dev`.
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 👥 Contributors

- **Muhammad Huzaifa**

---
© 2025 CDS Team. Created with &hearts;.
