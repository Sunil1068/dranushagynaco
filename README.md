# Gynaecologist Clinical Website

Full-stack clinical website for a Gynaecologist practice with patient portal and admin dashboard.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Recharts, Lucide Icons
- **Backend:** FastAPI, Motor (async MongoDB), JWT Auth
- **Database:** MongoDB Atlas

---

## Project Structure

```
Doctor website/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI app entry
│   │   ├── config.py        # Environment config
│   │   ├── database.py      # MongoDB connection
│   │   ├── models.py        # Pydantic models
│   │   ├── auth.py          # JWT + OTP logic
│   │   └── routes/
│   │       ├── auth_routes.py
│   │       ├── patient_routes.py
│   │       └── doctor_routes.py
│   ├── .env
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Public homepage
│   │   │   ├── globals.css
│   │   │   ├── login/page.tsx     # Patient OTP login
│   │   │   ├── doctor-login/page.tsx
│   │   │   ├── patient/page.tsx   # Patient portal
│   │   │   └── dashboard/page.tsx # Doctor dashboard
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   └── lib/
│   │       ├── api.ts
│   │       └── auth-context.tsx
│   ├── .env.local
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── README.md
```

---

## Setup Instructions

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
```

Edit `backend/.env` with your MongoDB Atlas connection string:
```
MONGODB_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/?retryWrites=true&w=majority
```

Start the backend:
```bash
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend available at: http://localhost:3000

---

## Default Credentials

### Doctor Login
- **Phone:** 9999999999
- **Password:** admin123

### Patient Login
- Enter any phone number
- OTP is displayed in dev mode (simulated)

---

## Features

### Public Website
- Hero section, About, Services, Experience, Testimonials, Contact

### Patient Portal
- OTP-based phone login
- Medical feedback form (condition, treatment, scores, etc.)
- View previous feedback history

### Doctor Dashboard
- Metrics: total patients, feedback count, satisfaction, success rate
- Bar chart: top conditions
- Line chart: monthly patient growth
- Feedback table with filters (condition, treatment, date range)
- Alerts: low satisfaction cases, complication cases

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/send-otp | - | Send OTP to phone |
| POST | /api/auth/verify-otp | - | Verify OTP & login |
| POST | /api/auth/doctor-login | - | Doctor login |
| GET | /api/patient/me | Patient | Get profile |
| POST | /api/patient/feedback | Patient | Submit feedback |
| GET | /api/patient/feedback | Patient | Get my feedback |
| GET | /api/doctor/metrics | Doctor | Dashboard metrics |
| GET | /api/doctor/feedback | Doctor | All feedback (filterable) |
| GET | /api/doctor/alerts/low-satisfaction | Doctor | Low satisfaction alerts |
| GET | /api/doctor/alerts/complications | Doctor | Complication alerts |
| GET | /api/doctor/patients | Doctor | All patients |
