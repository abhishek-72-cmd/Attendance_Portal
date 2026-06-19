# Employee Attendance Portal

A full-stack Employee Attendance Management System built using React.js, Node.js, PostgreSQL, and Sequelize ORM. The application provides role-based access for Employees, Managers, and HR users with attendance tracking, leave management, approval workflows, and user administration.

---

## Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Google OAuth Login
- Tailwind CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs
- Sequelize ORM

### Database
- PostgreSQL

---

## Features

### Authentication
- User Registration
- User Login
- Google Login Integration
- JWT Token Based Authentication
- Role Based Authorization
- Session Validation Middleware

### Employee Features
- Check-In Attendance
- Check-Out Attendance
- View Personal Attendance History
- Apply for Leave
- View Leave Status

### Manager Features
- View Team Attendance
- View Pending Team Leave Requests
- Approve Leave Requests
- Reject Leave Requests
- Mandatory Approval Remarks

### HR Features
- Create Users
- Deactivate Users
- Assign Managers
- View All Users
- View Organization Attendance
- Configure Leave Types
- View All Leave Requests

### Leave Management
- Leave Type Configuration
- Annual Leave Quota
- Leave Date Validation
- Overlapping Leave Prevention
- Approval Workflow

### Database
- Sequelize Models
- Sequelize Migrations
- PostgreSQL Integration

---

# Project Structure

```bash
attendance_portal/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── components/
│   │   └── App.jsx
│   └── package.json
│
├── database.sql
└── README.md
```

---

# Installation Guide

## Clone Repository

```bash
git clone https://github.com/abhishek-72-cmd/Attendance_Portal.git

cd Attendance_Portal
```

---

# Backend Setup

Navigate to backend folder

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create .env file

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=attendance_portal
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key

GOOGLE_CLIENT_ID=your_google_client_id
```

Run Sequelize Migrations

```bash
npx sequelize-cli db:migrate
```

Start Backend Server

```bash
npm start
```

Backend runs on:

```bash
http://localhost:5000
```

---

# Frontend Setup

Navigate to frontend folder

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Create .env file

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start Frontend

```bash
npm start
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# Database Setup

Create PostgreSQL Database

```sql
CREATE DATABASE attendance_portal;
```

Run migrations

```bash
npx sequelize-cli db:migrate
```

Optional seed data can be imported using:

```sql
database.sql
```

---

# User Roles

## Employee
- Check In
- Check Out
- View Attendance
- Apply Leave
- View Leave Status

## Manager
- All Employee Permissions
- View Team Attendance
- Approve Leave
- Reject Leave

## HR
- Create Users
- Deactivate Users
- Assign Managers
- Configure Leave Types
- View Organization Attendance
- View All Leave Requests

---

# API Endpoints

## Authentication

| Method | Endpoint |
|----------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| POST | /api/auth/google-login |
| GET | /api/auth/hr-only |
| GET | /api/auth/manager-data |

---

## Attendance

| Method | Endpoint |
|----------|----------|
| POST | /api/attendance/check-in |
| POST | /api/attendance/check-out |
| GET | /api/attendance/my |
| GET | /api/attendance/team |
| GET | /api/attendance/org |

---

## Leave Management

| Method | Endpoint |
|----------|----------|
| POST | /api/leave/apply |
| GET | /api/leave/my |
| GET | /api/leave/pending |
| GET | /api/leave/all |
| PUT | /api/leave/approve/:id |

---

## Leave Types

| Method | Endpoint |
|----------|----------|
| POST | /api/leave/type |
| PUT | /api/leave/type/:id |

---

## User Management

| Method | Endpoint |
|----------|----------|
| POST | /api/users/create |
| GET | /api/users |
| PUT | /api/users/deactivate/:id |
| PUT | /api/users/assign-manager/:id |

---

# Authentication

Protected routes require:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# Default Workflow

1. HR creates Employee and Manager accounts.
2. HR assigns reporting managers.
3. Employee checks attendance.
4. Employee applies for leave.
5. Manager approves/rejects leave.
6. HR monitors organization-wide data.

---

# Deployment

### Backend
Recommended: Render

### Frontend
Recommended: Vercel

### Database
Recommended: PostgreSQL (Render PostgreSQL / Neon / Supabase)

---

# Author

**Abhishek Vibhute**

Employee Attendance Portal Assignment