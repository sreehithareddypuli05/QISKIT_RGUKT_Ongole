# QIC Quantum Innovation Centre — RGUKT Ongole

Full-stack QIC portal with React/Vite frontend and FastAPI backend.

## Stack

- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- Backend: FastAPI + Uvicorn
- Database: PostgreSQL
- PostgreSQL driver: `psycopg2-binary`
- Authentication: JWT + PBKDF2 password hashing
- Email verification: SMTP
- Optional Google OAuth 2.0
- Deployment: Vercel (frontend) + Render (backend) + Neon PostgreSQL

---

# 1. Project structure

```text
qic_backend_final/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── src/
├── public/
├── package.json
├── vite.config.ts
├── vercel.json
└── .gitignore
```

The backend no longer uses `qic.db` or Python's `sqlite3`. PostgreSQL is the only application database.

---

# 2. Important security note

Never commit:

- `.env`
- SMTP passwords
- Google OAuth client secrets
- PostgreSQL passwords
- production JWT secrets

The project `.env.example` contains placeholders only.

If credentials from an older copy of this project were ever real and were shared publicly, rotate them before deployment.

---

# 3. How the PostgreSQL integration works

The application reads one environment variable:

```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:5432/DATABASE_NAME
```

At FastAPI startup, `init_db()` creates the required PostgreSQL tables if they do not already exist.

Tables created:

```text
users
pending_registrations
profiles
states
colleges
events
achievements
admins
oauth_states
user_activity
```

The application also inserts the initial states, colleges, events, achievements and admin account only when the corresponding data is missing.

There is no SQLite fallback.

---

# 4. LOCAL SETUP — WINDOWS

## Step 1 — Install PostgreSQL

Install PostgreSQL on Windows and remember the password you create for the PostgreSQL `postgres` administrator.

After installation, open **SQL Shell (psql)** or PowerShell.

Check:

```powershell
psql --version
```

If `psql` is not recognized, use the PostgreSQL SQL Shell from the Start menu.

---

# 5. Create the PostgreSQL database

Open SQL Shell / psql and connect as the PostgreSQL administrator.

Example:

```sql
psql -U postgres
```

Create an application user:

```sql
CREATE USER qic_user WITH PASSWORD 'CHANGE_THIS_TO_A_STRONG_PASSWORD';
```

Create the application database:

```sql
CREATE DATABASE qic_db OWNER qic_user;
```

Grant privileges:

```sql
GRANT ALL PRIVILEGES ON DATABASE qic_db TO qic_user;
```

Connect to the new database:

```sql
\c qic_db
```

Grant schema privileges as well:

```sql
GRANT ALL ON SCHEMA public TO qic_user;
```

Check that the database exists:

```sql
\l
```

Exit:

```sql
\q
```

## Important

Use a strong password instead of the example password.

Your final local connection string will look like:

```text
postgresql://qic_user:YOUR_PASSWORD@localhost:5432/qic_db
```

If your password contains special characters such as `@`, `:`, `/`, `#`, or `%`, URL-encode the password before putting it in `DATABASE_URL`.

---

# 6. Backend environment setup

Open:

```text
backend/
```

Copy:

```text
.env.example
```

to:

```text
.env
```

PowerShell:

```powershell
cd backend
Copy-Item .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://qic_user:YOUR_PASSWORD@localhost:5432/qic_db

QIC_SECRET_KEY=PUT_A_LONG_RANDOM_SECRET_HERE
QIC_TOKEN_MINUTES=240
ADMIN_PASSWORD=PUT_A_STRONG_ADMIN_PASSWORD_HERE

FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
SMTP_FROM=your-email@gmail.com

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

Generate a secure JWT secret:

```powershell
py -c "import secrets; print(secrets.token_urlsafe(64))"
```

Copy the generated value into:

```env
QIC_SECRET_KEY=...
```

Do not use the example secret in production.

---

# 7. Create the Python virtual environment

From the `backend` directory:

```powershell
py -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, run PowerShell as your normal user and use:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Then activate again:

```powershell
.\.venv\Scripts\Activate.ps1
```

---

# 8. Install backend dependencies

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

The important PostgreSQL dependency is:

```text
psycopg2-binary
```

---

# 9. Start the backend

From:

```text
qic_backend_final/backend
```

run:

```powershell
uvicorn main:app --reload --port 8000
```

Expected API:

```text
http://127.0.0.1:8000
```

Health check:

```text
http://127.0.0.1:8000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "qic-api"
}
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

The first successful startup creates the PostgreSQL tables automatically.

---

# 10. Verify PostgreSQL tables

Open psql:

```powershell
psql -U qic_user -d qic_db
```

Run:

```sql
\dt
```

You should see tables similar to:

```text
users
pending_registrations
profiles
states
colleges
events
achievements
admins
oauth_states
user_activity
```

Check users:

```sql
SELECT id, first_name, last_name, email, verified, profile_complete, role
FROM users;
```

Check events:

```sql
SELECT id, title, published
FROM events
ORDER BY id DESC;
```

Check achievements:

```sql
SELECT id, title, published
FROM achievements
ORDER BY id DESC;
```

Exit:

```sql
\q
```

---

# 11. Start the frontend

Open a second PowerShell window.

Go to the project root:

```powershell
cd qic_backend_final
```

Install dependencies:

```powershell
npm install
```

Create a frontend environment file:

```text
.env.local
```

Add:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start Vite:

```powershell
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# 12. Local architecture

```text
Browser
   |
   | http://localhost:5173
   v
React + Vite
   |
   | VITE_API_URL
   | http://127.0.0.1:8000
   v
FastAPI
   |
   | psycopg2
   v
PostgreSQL
   |
   +-- users
   +-- profiles
   +-- events
   +-- achievements
   +-- admins
   +-- user_activity
   +-- states
   +-- colleges
   +-- pending_registrations
   +-- oauth_states
```

---

# 13. Email verification setup

Registration requires real SMTP delivery.

For Gmail:

1. Use a Google account with 2-Step Verification enabled.
2. Create a Gmail App Password.
3. Put the generated App Password in:

```env
SMTP_PASSWORD=YOUR_GMAIL_APP_PASSWORD
```

Do not use the normal Gmail account password.

Example:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
```

Restart FastAPI after changing `.env`.

Test registration from the frontend.

The flow is:

```text
Register
   ↓
Backend creates 6-digit verification code
   ↓
Code is hashed
   ↓
Pending registration is stored in PostgreSQL
   ↓
Email is sent
   ↓
User enters code
   ↓
Backend verifies code
   ↓
User is created in PostgreSQL
   ↓
JWT is returned
   ↓
Profile setup
   ↓
Profile stored in PostgreSQL
```

---

# 14. Google OAuth setup

Google login is optional.

Create a Google OAuth Web Application and configure the local callback:

```text
http://localhost:8000/api/auth/google/callback
```

Set:

```env
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

Restart the backend.

For production, replace the callback with:

```text
https://YOUR-BACKEND-DOMAIN/api/auth/google/callback
```

The exact production callback URL must also be added to the Google OAuth application's authorized redirect URIs.

---

# 15. Create a GitHub repository

Before pushing, verify that secrets are ignored:

```powershell
git status
```

Make sure `.env` is NOT listed as a file to commit.

Also make sure these are not committed:

```text
backend/.env
backend/.venv/
backend/qic.db
.env.local
node_modules/
dist/
```

Initialize Git if needed:

```powershell
git init
```

Add files:

```powershell
git add .
```

Commit:

```powershell
git commit -m "Add PostgreSQL backend and production deployment setup"
```

Add your GitHub repository:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Push:

```powershell
git branch -M main
git push -u origin main
```

---

# 16. PRODUCTION DATABASE — NEON POSTGRESQL

A simple deployment architecture for this project is:

```text
Vercel
   |
   | HTTPS
   v
React frontend
   |
   | HTTPS API requests
   v
Render FastAPI backend
   |
   | PostgreSQL connection
   v
Neon PostgreSQL
```

## Step 1 — Create Neon project

Create a PostgreSQL project in Neon.

Choose a region reasonably close to your backend deployment region.

Create/open the database and copy its PostgreSQL connection string.

A Neon connection string commonly looks like:

```text
postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

Use the pooled connection string when Neon provides one.

Do not publish the connection string.

## Step 2 — Keep the connection string private

You will put the connection string into Render as:

```text
DATABASE_URL
```

Do not put it in GitHub.

---

# 17. DEPLOY BACKEND TO RENDER

## Step 1 — Create Render Web Service

Open Render and create:

```text
New → Web Service
```

Connect your GitHub repository.

## Step 2 — Configure the repository

Because this project contains the frontend and backend together:

```text
Root Directory:
qic_backend_final/backend
```

If your GitHub repository itself is already the `qic_backend_final` folder, use:

```text
Root Directory:
backend
```

Choose the path that matches the actual repository root.

## Step 3 — Runtime

Choose:

```text
Python
```

## Step 4 — Build command

```bash
pip install -r requirements.txt
```

## Step 5 — Start command

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

## Step 6 — Health check

Set:

```text
/api/health
```

## Step 7 — Environment variables

Add these in Render:

```env
DATABASE_URL=YOUR_NEON_POSTGRES_CONNECTION_STRING

QIC_SECRET_KEY=YOUR_LONG_RANDOM_SECRET
QIC_TOKEN_MINUTES=240
ADMIN_PASSWORD=YOUR_STRONG_ADMIN_PASSWORD

FRONTEND_URL=https://YOUR-FRONTEND.vercel.app
CORS_ORIGINS=https://YOUR-FRONTEND.vercel.app

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
SMTP_FROM=your-email@gmail.com

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI=https://YOUR-BACKEND.onrender.com/api/auth/google/callback
```

For `CORS_ORIGINS`, use the exact frontend origin without a trailing slash.

Example:

```env
CORS_ORIGINS=https://qic-rgukt.vercel.app
```

If you later add a custom frontend domain:

```env
CORS_ORIGINS=https://qic.example.com
```

## Step 8 — Deploy

Click:

```text
Create Web Service
```

Render installs the dependencies and starts:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

The backend receives its public URL, for example:

```text
https://YOUR-BACKEND.onrender.com
```

Do not copy the example URL literally.

---

# 18. Verify the production backend

Open:

```text
https://YOUR-BACKEND.onrender.com/api/health
```

Expected:

```json
{
  "status": "ok",
  "service": "qic-api"
}
```

Open:

```text
https://YOUR-BACKEND.onrender.com/docs
```

Swagger should load.

Then check the database in Neon.

The application should have created:

```text
users
pending_registrations
profiles
states
colleges
events
achievements
admins
oauth_states
user_activity
```

---

# 19. IMPORTANT — first production startup

Before the first production deployment, make sure these values are already set:

```env
DATABASE_URL=...
QIC_SECRET_KEY=...
ADMIN_PASSWORD=...
FRONTEND_URL=...
CORS_ORIGINS=...
```

The application seeds the administrator on first startup:

```text
username: admin
password: value of ADMIN_PASSWORD
```

Therefore, set the production `ADMIN_PASSWORD` before the first production startup.

After deployment, change the password if required by your security policy.

---

# 20. DEPLOY FRONTEND TO VERCEL

## Step 1 — Create Vercel project

Import the same GitHub repository into Vercel.

Because the repository contains the frontend and backend, set the Vercel Root Directory to the folder containing:

```text
package.json
src/
public/
vite.config.ts
```

For the supplied project this is:

```text
qic_backend_final
```

if that is the repository root structure.

## Step 2 — Framework

Vercel should detect:

```text
Vite
```

## Step 3 — Build command

```bash
npm run build
```

## Step 4 — Output directory

```text
dist
```

## Step 5 — Environment variable

Add:

```env
VITE_API_URL=https://YOUR-BACKEND.onrender.com
```

Do not add `/` at the end.

Correct:

```env
VITE_API_URL=https://qic-api.onrender.com
```

Avoid:

```env
VITE_API_URL=https://qic-api.onrender.com/
```

The frontend code already removes a trailing slash, but keeping the environment value clean avoids confusion.

## Step 6 — Deploy

Click:

```text
Deploy
```

Vercel builds:

```bash
npm run build
```

and publishes:

```text
dist/
```

---

# 21. Why `vercel.json` is included

This project uses React Router.

The included `vercel.json` rewrites frontend routes to:

```text
/index.html
```

This prevents a direct refresh such as:

```text
https://YOUR-FRONTEND.vercel.app/events
```

from returning a server-side 404.

---

# 22. Connect frontend and backend

After Vercel gives you the frontend URL, for example:

```text
https://qic-rgukt.vercel.app
```

go back to Render and update:

```env
FRONTEND_URL=https://qic-rgukt.vercel.app
CORS_ORIGINS=https://qic-rgukt.vercel.app
```

Then redeploy the backend.

In Vercel, make sure:

```env
VITE_API_URL=https://YOUR-BACKEND.onrender.com
```

is set for the Production environment.

Redeploy the frontend after changing the variable.

---

# 23. Update Google OAuth for production

Once both URLs are available:

Frontend:

```text
https://YOUR-FRONTEND.vercel.app
```

Backend:

```text
https://YOUR-BACKEND.onrender.com
```

Set:

```env
GOOGLE_REDIRECT_URI=https://YOUR-BACKEND.onrender.com/api/auth/google/callback
```

Then add the exact callback URL to your Google OAuth Web Application.

Do not leave the production application pointing to:

```text
http://localhost:8000/api/auth/google/callback
```

---

# 24. Production authentication flow

After deployment:

```text
User
 |
 v
Vercel React app
 |
 | POST /api/auth/request-verification
 v
Render FastAPI
 |
 v
Neon PostgreSQL
 |
 +-- pending_registrations
 |
 +-- SMTP email
 |
 v
User enters OTP
 |
 v
POST /api/auth/verify-verification
 |
 v
users table
 |
 v
JWT
 |
 v
Profile setup
 |
 v
profiles table
```

---

# 25. Admin flow

Admin login:

```text
POST /api/admin/login
```

The admin account is stored in:

```text
admins
```

Admin content changes are stored in:

```text
events
achievements
```

The public website reads published records through:

```text
GET /api/events
GET /api/achievements
```

Therefore, changing an event or achievement in the admin system changes the data returned by the public API.

---

# 26. Database backup

Before production changes, create PostgreSQL backups.

For a PostgreSQL database that is accessible from your machine:

```powershell
pg_dump "YOUR_DATABASE_URL" > qic_backup.sql
```

Restore:

```powershell
psql "YOUR_DATABASE_URL" < qic_backup.sql
```

For managed PostgreSQL providers, also use the provider's backup/restore facilities when available.

Never store database backup files containing user information in a public Git repository.

---

# 27. Useful PostgreSQL commands

Connect:

```powershell
psql "YOUR_DATABASE_URL"
```

List tables:

```sql
\dt
```

List databases:

```sql
\l
```

Describe a table:

```sql
\d users
```

Count registered users:

```sql
SELECT COUNT(*) FROM users;
```

Count completed profiles:

```sql
SELECT COUNT(*) FROM users WHERE profile_complete = 1;
```

Count events:

```sql
SELECT COUNT(*) FROM events;
```

Count achievements:

```sql
SELECT COUNT(*) FROM achievements;
```

View latest login activity:

```sql
SELECT *
FROM user_activity
ORDER BY id DESC
LIMIT 20;
```

Exit:

```sql
\q
```

---

# 28. Full deployment checklist

## Database

- [ ] PostgreSQL database created
- [ ] `DATABASE_URL` created
- [ ] SSL connection enabled for managed PostgreSQL
- [ ] PostgreSQL password kept private
- [ ] Tables created successfully
- [ ] Seed data visible
- [ ] Database backup strategy prepared

## Backend

- [ ] `psycopg2-binary` installed
- [ ] `DATABASE_URL` configured
- [ ] `QIC_SECRET_KEY` changed
- [ ] `QIC_TOKEN_MINUTES` configured
- [ ] `ADMIN_PASSWORD` changed
- [ ] SMTP configured
- [ ] Google OAuth configured if required
- [ ] `FRONTEND_URL` configured
- [ ] `CORS_ORIGINS` configured
- [ ] `/api/health` returns `status: ok`
- [ ] `/docs` loads

## Frontend

- [ ] `VITE_API_URL` points to production backend
- [ ] `npm run build` succeeds
- [ ] Vercel deployment succeeds
- [ ] React routes work after refresh
- [ ] Login works
- [ ] Registration works
- [ ] OTP email arrives
- [ ] Profile saves
- [ ] Events load
- [ ] Achievements load

## Google OAuth

- [ ] Production callback URL added
- [ ] `GOOGLE_REDIRECT_URI` updated
- [ ] Google client ID configured
- [ ] Google client secret configured
- [ ] OAuth login tested

---

# 29. Common errors

## Error: `DATABASE_URL is required`

Cause:

```env
DATABASE_URL
```

is missing.

Fix:

Create:

```text
backend/.env
```

and add the PostgreSQL connection string.

For Render, add `DATABASE_URL` in the service Environment settings.

---

## Error: `connection refused`

Example:

```text
could not connect to server
```

Check:

1. PostgreSQL is running.
2. Host is correct.
3. Port is correct.
4. Username is correct.
5. Password is correct.
6. Database name is correct.

Local example:

```text
postgresql://qic_user:PASSWORD@localhost:5432/qic_db
```

---

## Error: `password authentication failed`

Your PostgreSQL username/password is incorrect.

Reset the database user's password:

```sql
ALTER USER qic_user WITH PASSWORD 'NEW_PASSWORD';
```

Then update `DATABASE_URL`.

---

## Error: `relation "users" does not exist`

The backend has not successfully completed startup.

Check Render/backend logs.

Then verify:

```sql
\dt
```

The application creates the tables automatically during startup.

---

## Error: CORS

Example:

```text
Access to fetch ... has been blocked by CORS policy
```

Check:

```env
FRONTEND_URL=https://YOUR-FRONTEND.vercel.app
CORS_ORIGINS=https://YOUR-FRONTEND.vercel.app
```

Do not put the backend URL into `CORS_ORIGINS`.

`CORS_ORIGINS` must contain the browser frontend origin.

Redeploy/restart the backend after changing environment variables.

---

## Error: frontend still calls localhost

Check Vercel:

```env
VITE_API_URL=https://YOUR-BACKEND.onrender.com
```

Then redeploy the frontend.

Vite environment variables are embedded into the frontend build, so changing the variable requires a new frontend build/deployment.

---

## Error: Google OAuth redirects to localhost

Update:

```env
GOOGLE_REDIRECT_URI=https://YOUR-BACKEND.onrender.com/api/auth/google/callback
```

and update the same exact URL in the Google OAuth configuration.

---

## Error: OTP not arriving

Check:

```env
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
SMTP_FROM
```

For Gmail, use an App Password.

Then check the backend deployment logs.

---

# 30. Production URLs

After deployment, keep these three values together:

```text
Frontend:
https://YOUR-FRONTEND.vercel.app

Backend:
https://YOUR-BACKEND.onrender.com

Database:
Neon PostgreSQL
```

Frontend:

```env
VITE_API_URL=https://YOUR-BACKEND.onrender.com
```

Backend:

```env
FRONTEND_URL=https://YOUR-FRONTEND.vercel.app
CORS_ORIGINS=https://YOUR-FRONTEND.vercel.app
DATABASE_URL=YOUR_NEON_POSTGRES_URL
```

Google OAuth:

```env
GOOGLE_REDIRECT_URI=https://YOUR-BACKEND.onrender.com/api/auth/google/callback
```

---

# 31. Final recommended deployment order

Do these in exactly this order:

```text
1. Install PostgreSQL locally
        ↓
2. Create qic_db and qic_user
        ↓
3. Configure backend/.env
        ↓
4. Install Python dependencies
        ↓
5. Start FastAPI
        ↓
6. Confirm PostgreSQL tables were created
        ↓
7. Start React frontend
        ↓
8. Test login/profile/admin locally
        ↓
9. Push clean project to GitHub
        ↓
10. Create Neon PostgreSQL production database
        ↓
11. Deploy FastAPI backend to Render
        ↓
12. Add Render environment variables
        ↓
13. Confirm /api/health and /docs
        ↓
14. Confirm tables in production PostgreSQL
        ↓
15. Deploy React frontend to Vercel
        ↓
16. Set VITE_API_URL in Vercel
        ↓
17. Update Render CORS/FRONTEND_URL
        ↓
18. Update Google OAuth callback
        ↓
19. Test registration + OTP
        ↓
20. Test Google login
        ↓
21. Test profile saving
        ↓
22. Test admin login
        ↓
23. Test event/achievement CRUD
        ↓
24. Test logout/activity
        ↓
25. Take a production database backup
```

---

# 32. API endpoints

## Health

```text
GET /api/health
```

## Authentication

```text
POST /api/auth/request-verification
POST /api/auth/verify-verification
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
GET  /api/auth/google/start
GET  /api/auth/google/callback
```

## Profile/meta

```text
POST /api/profile
GET  /api/profile
GET  /api/meta/states
GET  /api/meta/colleges?state=Andhra%20Pradesh
```

## Public content

```text
GET /api/events
GET /api/achievements
```

## Admin

```text
POST   /api/admin/login
GET    /api/admin/overview
GET    /api/admin/users
GET    /api/admin/activity
GET    /api/admin/events
POST   /api/admin/events
PUT    /api/admin/events/{id}
DELETE /api/admin/events/{id}
GET    /api/admin/achievements
POST   /api/admin/achievements
PUT    /api/admin/achievements/{id}
DELETE /api/admin/achievements/{id}
```

---

# 33. Production database design

```text
users
 ├── id
 ├── first_name
 ├── last_name
 ├── email
 ├── password_hash
 ├── google_id
 ├── verified
 ├── profile_complete
 ├── role
 └── created_at

profiles
 ├── user_id
 ├── country
 ├── state
 ├── college
 ├── degree
 ├── branch
 ├── year
 ├── qiskit_experience
 ├── programming_languages
 ├── activities
 ├── quantum_level
 ├── referral_code
 └── updated_at

events
 ├── id
 ├── title
 ├── description
 ├── date
 ├── link
 ├── image
 ├── location
 └── published

achievements
 ├── id
 ├── title
 ├── description
 ├── date
 ├── link
 ├── image
 ├── location
 └── published

admins
 ├── id
 ├── username
 └── password_hash

user_activity
 ├── id
 ├── user_id
 ├── event
 ├── ip_address
 ├── user_agent
 └── created_at
```

---

# 34. Important architecture note

This version intentionally keeps the existing FastAPI route structure and frontend API calls.

The major database change is:

```text
OLD:
FastAPI → sqlite3 → qic.db

NEW:
FastAPI → psycopg2 → PostgreSQL
```

Therefore the existing frontend does not need a database rewrite.

For a future larger production system, Alembic migrations can be added so schema changes are versioned instead of relying only on startup table creation.

---

# 35. Official deployment references

Render FastAPI deployment:
https://render.com/templates/fastapi

Render deployment documentation:
https://render.com/docs/deploys

Render web services:
https://render.com/docs/web-services

Vercel Vite deployment:
https://vercel.com/docs/frameworks/frontend/vite

Neon PostgreSQL:
https://neon.com/

Vercel configuration:
https://vercel.com/docs/project-configuration/vercel-json
