# 🧾 Employee Attendance Portal

A full-stack web application to manage employee attendance, leave requests, and approvals with role-based access.

---

# 🚀 Tech Stack

* Frontend: React.js (Vite + Tailwind CSS)
* Backend: Node.js + Express.js
* ORM: Sequelize
* Database: PostgreSQL

---

# 📁 Project Structure

```
attendance_portal/
├── frontend/
├── backend/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   └── controllers/
├── database.sql
└── README.md
```

---

# ⚙️ Setup Instructions

---

# 🗄️ DATABASE SETUP (VERY IMPORTANT)

## ✅ STEP 1 — Using Sequelize Migrations (PRIMARY METHOD)

👉 This will create all required tables.

### 1. Create Database

```sql
CREATE DATABASE attendance_db;
```

---

### 2. Configure Database

Update:

```
backend/config/config.json
```

Example:

```json
{
  "development": {
    "username": "postgres",
    "password": "your_password",
    "database": "attendance_db",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

---

### 3. Run Migrations

```bash
cd backend
npx sequelize-cli db:migrate
```

👉 This will create:

* Users table
* Attendance table
* Leave tables
* Leave types tables

---

## ⚠️ IMPORTANT NOTE

* Migrations create **structure only**
* They do **NOT insert sample data**
* So application may start with empty data

---

# 🧪 STEP 2 — Backup Method (USE IF DATA IS MISSING)

👉 If no users / data are visible after migration, use SQL backup

### Run:

```bash
psql -U postgres -d attendance_db -f database.sql
```

👉 This will:

* Create tables (if not exists)
* Insert sample users
* Insert leave types
* Make app fully usable instantly

---

# 🔐 Sample Users (after SQL import)

| Role     | Email                                           | Password |
| -------- | ----------------------------------------------- | -------- |
| HR       | [hr@gmail.com](mailto:hr@gmail.com)             | 123456   |
| Manager  | [manager@gmail.com](mailto:manager@gmail.com)   | 123456   |
| Employee | [employee@gmail.com](mailto:employee@gmail.com) | 123456   |

---

# 🔌 Backend Setup

```bash
cd backend
npm install
npm start
```

Runs on:

```
http://localhost:5000
```

---

# 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

# 🔑 Environment Variables

Create `.env` inside backend:

```
PORT=5000
JWT_SECRET=secret123
```

---

# 📡 API Overview

## Auth

* POST `/api/auth/register`
* POST `/api/auth/login`

## Attendance

* GET `/api/attendance/my`
* GET `/api/attendance/team`
* GET `/api/attendance/org`
* POST `/api/attendance/check-in`
* POST `/api/attendance/check-out`

## Leave

* POST `/api/leave/apply`
* GET `/api/leave/my`
* GET `/api/leave/pending`
* PUT `/api/leave/approve/:id`
* GET `/api/leave/all`

## Leave Types (HR)

* POST `/api/leave/type`
* PUT `/api/leave/type/:id`
* GET `/api/leave/types`

---

# 🚨 Common Issues

### ❌ Tables not found
👉 Run:

```
npx sequelize-cli db:migrate
```
---

### ❌ No users / empty data

👉 Run:

```
psql -U postgres -d attendance_db -f database.sql
```

---

### ❌ Session expired

👉 Check token storage in frontend

---

# 📦 Submission Files

* README.md
* frontend.zip
* backend.zip
* database.sql

---

# 👨‍💻 Author
Abhishek Vibhute
