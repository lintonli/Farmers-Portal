# Farmers Portal - Certification Management System

A full-stack application for managing farmer certifications where farmers can register and apply for certification, and administrators can review and approve/decline applications.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Option 1: Docker Setup (Recommended)](#option-1-docker-setup-recommended)
  - [Option 2: Local Development Setup](#option-2-local-development-setup)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Assumptions](#assumptions)

## Features

### Farmer Features
-  User registration with farm details (farm size, crop type)
-  Secure login with JWT authentication
-  View personal certification status dashboard
-  Real-time status updates (Pending, Certified, Declined)

### Admin Features
-  View all registered farmers in a table
-  Certify farmer applications
-  Decline farmer applications
-  Dashboard with statistics (total, pending, certified, declined)

## Tech Stack

### Backend
- **Node.js** with **Express.js** (v5.2.1)
- **TypeScript** for type safety
- **PostgreSQL** database
- **Prisma ORM** (v7.2.0) with PrismaPg adapter
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Joi** for request validation

### Frontend
- **React** (v19.2.0) with **TypeScript**
- **Vite** (v7.2.4) as build tool
- **React Router DOM** for navigation
- **Axios** for HTTP requests
- **Tailwind CSS** for styling
- **React Hot Toast** for notifications

### DevOps
- **Docker** & **Docker Compose**
- **GitHub Actions** for CI/CD

## Prerequisites

### For Docker Setup:
- Docker Desktop (v20.10+)
- Docker Compose (v2.0+)

### For Local Setup:
- Node.js (v20+)
- PostgreSQL (v16+)
- npm or yarn

## Setup Instructions

### Option 1: Docker Setup (Recommended)

This option runs the backend API and PostgreSQL database in Docker containers. The frontend runs locally for easier development.

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Farmers-Portal
   ```

2. **Start Docker services (Database + API)**
   ```bash
   docker-compose up --build
   ```
   
   This will:
   - Start PostgreSQL on port 5432
   - Start the backend API on port 4000
   - Run database migrations automatically
   - Seed the database with initial data (admin user)

3. **Start the frontend** (in a new terminal)
   ```bash
   cd ui
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000
   - Database: localhost:5432

5. **Default admin credentials** (seeded automatically check seedUsers.ts or use the ones below)
   ```
   Email: admin@example.com
   Password: admin@example.com
   ```

### Option 2: Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Farmers-Portal
   ```

2. **Setup PostgreSQL Database**
   ```bash
   # Create database
   createdb farmers
   ```

3. **Setup Backend**
   ```bash
   cd api
   npm install
   
   # Create .env file
   cp .env.example .env  # or create manually (see Environment Variables section)
   
   # Run migrations
   npx prisma migrate deploy
   
   # Seed database
   npx prisma db seed
   
   # Start backend
   npm start
   ```

4. **Setup Frontend** (in a new terminal)
   ```bash
   cd ui
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## API Documentation

### Base URL
```
http://localhost:4000/api/users
```

### Authentication
All protected routes require a JWT token in the `token` header:
```
Headers: { "token": "your-jwt-token" }
```

---

### Endpoints

#### 1. **Register Farmer**
```http
POST /register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phoneNumber": "+254712345678",
  "farmSize": 10.5,
  "cropType": "Wheat"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "john.doe@example.com",
    "role": "farmer",
    "farmer": {
      "certificationStatus": "pending"
    }
  }
}
```

---

#### 2. **Login**
```http
POST /login
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "john.doe@example.com",
    "role": "farmer"
  }
}
```

---

#### 3. **Get All Farmers** (Admin Only)
```http
GET /farmers
```

**Headers:**
```
token: your-jwt-token
```

**Response:** `200 OK`
```json
{
  "users": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "farmer",
      "farmer": {
        "farmSize": 10.5,
        "cropType": "Wheat",
        "certificationStatus": "pending",
        "appliedAt": "2026-01-12T10:30:00.000Z"
      }
    }
  ]
}
```

---

#### 4. **Update Certification Status** (Admin Only)
```http
PATCH /farmers/:userId/status
```

**Headers:**
```
token: your-jwt-token
```

**Request Body:**
```json
{
  "status": "certified"
}
```

**Valid status values:** `pending`, `certified`, `declined`

**Response:** `200 OK`
```json
{
  "message": "Status updated successfully",
  "user": {
    "id": "uuid",
    "farmer": {
      "certificationStatus": "certified"
    }
  }
}
```

---

#### 5. **Get Farmer Status by ID**
```http
GET /farmers/:id/status
```

**Headers:**
```
token: your-jwt-token
```

**Response:** `200 OK`
```json
{
  "farmer": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "farmSize": 10.5,
    "cropType": "Wheat",
    "certificationStatus": "certified",
    "appliedAt": "2026-01-12T10:30:00.000Z"
  }
}
```

---

### Error Responses

All endpoints return consistent error responses:

**400 Bad Request** - Validation error
```json
{
  "message": "Validation error",
  "errors": ["Email is required", "Password must be at least 6 characters"]
}
```

**401 Unauthorized** - Authentication error
```json
{
  "message": "Invalid credentials"
}
```

**403 Forbidden** - Authorization error
```json
{
  "message": "Access denied"
}
```

**404 Not Found** - Resource not found
```json
{
  "message": "User not found"
}
```

**500 Internal Server Error** - Server error
```json
{
  "message": "Internal server error"
}
```

---

## Environment Variables

### Backend (.env in /api directory)

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/farmers?schema=public"

# JWT Secret (Change in production!)
JWT_SECRET=qazwsxedcrfvtgbyhnujmikolp

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Timezone
APP_TIMEZONE=Africa/Nairobi
```

### Frontend
No environment variables required for frontend.

---

## Project Structure

```
Farmers-Portal/
├── api/                          # Backend application
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   │   └── userController.ts
│   │   ├── middleware/           # Auth & validation middleware
│   │   │   └── authMiddleware.ts
│   │   ├── prisma/              # Database
│   │   │   ├── schema.prisma    # Database schema
│   │   │   ├── db.ts            # Prisma client config
│   │   │   ├── migrations/      # Database migrations
│   │   │   └── seeders/         # Seed data
│   │   ├── routes/              # API routes
│   │   │   └── userRoutes.ts
│   │   ├── Types/               # TypeScript types
│   │   ├── utils/               # Utilities
│   │   │   ├── authUtils.ts     # JWT & password hashing
│   │   │   └── logger.ts        # Logging
│   │   └── server.ts            # Express app setup
│   ├── prisma.config.ts         # Prisma 7 configuration
│   ├── tsconfig.json            # TypeScript config
│   └── package.json
├── ui/                          # Frontend application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Register.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── FarmerDashboard.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── Services/            # API service layer
│   │   │   └── api.ts
│   │   ├── Types/               # TypeScript interfaces
│   │   │   └── index.ts
│   │   ├── App.tsx              # Main app component
│   │   └── main.tsx             # Entry point
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── vite.config.ts           # Vite config
│   └── package.json
├── .github/
│   └── workflows/               # GitHub Actions CI/CD
│       ├── ci.yml
├── docker-compose.yml           # Docker services
├── Dockerfile.api               # Backend Docker image
└── README.md
```

---

## Assumptions

### 1. **Authentication & Authorization**
- JWT tokens are stored in localStorage on the frontend
- Token expiration is managed by JWT (default: no expiration set)
- Only two roles exist: `farmer` and `admin`
- Farmers can only view their own status
- Admins can view and update all farmers

### 2. **Database**
- Each user has only one role (no multi-role support)
- A farmer record is automatically created when a user with role "farmer" registers
- UUID is used as the primary key for scalability
- Certification status defaults to "pending" on registration
- Database migrations are run automatically on container startup

### 3. **Security**
- Passwords are hashed using bcrypt (10 salt rounds)
- CORS is configured to allow requests from the frontend URL only
- Environment variables contain sensitive data (should use secrets manager in production)
- No rate limiting implemented (should be added for production)

### 4. **Business Logic**
- Farm size is measured in acres (numeric field)
- Crop type is free text (could be normalized to enum in production)
- Once declined, a farmer must contact support (no re-application flow)
- No email verification required for registration
- Admin account is pre-seeded (email: admin@example.com, password: admin@example.com)

### 5. **Frontend**
- Runs on development server (Vite) - not optimized for production
- No pagination on admin farmer list (assumes reasonable data size)

### 6. **Docker**
- Only backend and database are dockerized (frontend runs locally)
- Database data persists in Docker volumes
- Development environment configuration (not production-ready)
- Auto-runs migrations and seeds on first startup

### 7. **Testing**
- No automated tests included
- Manual testing via Postman/browser recommended
- API endpoints tested manually during development

### 8. **Scalability**
- Single server setup (no load balancing)
- PostgreSQL single instance (no replication)
- No caching layer (Redis could be added)
- No CDN for static assets

---

## Testing

### Manual Testing Steps

1. **Register a new farmer**
   - Navigate to http://localhost:5173/register
   - Fill in all required fields
   - Submit form
   - Verify redirect to login page

2. **Login as farmer**
   - Use registered credentials
   - Verify redirect to farmer dashboard
   - Check certification status shows "pending"

3. **Login as admin**
   - Email: admin@example.com
   - Password: admin123
   - Verify redirect to admin dashboard
   - Check all farmers are listed

4. **Update farmer status**
   - Click "Certify" or "Decline" button
   - Verify toast notification appears
   - Verify status updates in table

5. **Check farmer status update**
   - Logout from admin
   - Login as the farmer
   - Verify status has changed on dashboard

---

##  Troubleshooting

### Docker Issues

**Port already in use:**
```bash
# Stop existing containers
docker-compose down

# Change ports in docker-compose.yml if needed
```

**Database connection failed:**
```bash
# Check if database is running
docker-compose ps

# View logs
docker-compose logs db

# Recreate database
docker-compose down -v
docker-compose up --build
```

### Frontend Issues

**CORS errors:**
- Verify backend is running on port 4000
- Check FRONTEND_URL in backend .env matches frontend URL
- Restart backend after .env changes

**Module not found:**
```bash
cd ui
rm -rf node_modules package-lock.json
npm install
```

### Backend Issues

**Prisma errors:**
```bash
cd api
npx prisma generate
npx prisma migrate deploy
```

**TypeScript errors:**
```bash
cd api
npm run build
```

##  Author

**Linton Edimund Maina**

---

