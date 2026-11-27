# HumaNex Backend - Authentication & Authorization

This backend handles authentication (JWT + bcrypt + HTTP cookies) and role-based authorization for the HumaNex healthcare platform, backed by MySQL (local or cloud-hosted).

---

## Architecture Overview

All authentication and authorization logic is organized in the `auth/` directory:

```
backend/
├── auth/
│   ├── config/
│   │   └── db.js            # MySQL connection pool + SSL support + auto-schema initialization
│   ├── controllers/
│   │   └── auth.controller.js # Signup, Login, Logout, Profile (me), Role validation
│   ├── middleware/
│   │   └── auth.middleware.js # authenticateToken (JWT) & authorizeRoles (RBAC)
│   ├── models/
│   │   └── user.model.js    # MySQL user queries (findByEmail, findById, create)
│   ├── routes/
│   │   └── auth.routes.js   # Public & role-protected route definitions
│   ├── schema.sql           # SQL schema for direct DB creation
│   └── index.js             # Unified module exports
├── src/
│   ├── lib/
│   │   └── env.js           # Environment variable validation
│   ├── routes/
│   │   └── auth.route.js    # Mounts auth/routes into Express
│   └── server.js            # Express server (CORS, cookies, error handling)
├── .env                     # Your local/cloud credentials (ignored in git)
└── .env.example             # Template for configuration
```

---

## Deploying MySQL to the Cloud

You can deploy your MySQL database on any cloud provider, such as:
- **TiDB Cloud** (Free Serverless MySQL)
- **Aiven for MySQL** (Free tier available)
- **Railway** / **Clever Cloud** / **Render**
- **AWS RDS** / **Google Cloud SQL** / **DigitalOcean**

### Option A: Using Single Connection URL
In your `.env` file, set:
```env
MYSQL_URL=mysql://<username>:<password>@<host>:<port>/<database_name>?ssl={"rejectUnauthorized":false}
```

### Option B: Using Discrete Environment Variables
```env
MYSQL_HOST=your-cloud-db-host.com
MYSQL_PORT=3306
MYSQL_USER=your_db_username
MYSQL_PASSWORD=your_db_password
MYSQL_DATABASE=humanex_db
MYSQL_SSL=true
```

> **Note on Auto-Table Creation**:
> When the backend server boots up, `initDB()` in `auth/config/db.js` automatically creates the `users` table if it does not already exist. You do not need to manually run any SQL queries.

---

## Roles and Authorization

The system supports 3 primary roles matching the frontend:
1. **`patient`**: Access to Patient Dashboard (`Date of birth` required on registration).
2. **`doctor`**: Access to Clinician Dashboard (`Medical registration number` required on registration).
3. **`hospital`**: Access to Hospital Management (`Hospital / organization name` required on registration).

### Endpoints:
- `POST /api/auth/signup`: Create user account (`name`, `email`, `password`, `role`, `extra`).
- `POST /api/auth/login`: Authenticate existing user (`email`, `password`, `role`).
- `POST /api/auth/logout`: Invalidate session and clear auth cookie.
- `GET /api/auth/me`: Fetch authenticated user profile (requires Bearer token or cookie).
- `GET /api/auth/patient-only`: Protected route requiring `patient` role.
- `GET /api/auth/doctor-only`: Protected route requiring `doctor` role.
- `GET /api/auth/hospital-only`: Protected route requiring `hospital` role.

---

## Running the Backend

```bash
cd HumaNex/backend
npm install
npm run dev
```

The server runs on `http://localhost:5000` by default.
