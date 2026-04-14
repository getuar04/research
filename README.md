# 🚀 Backend Research Project (Node.js)

A modern backend system built with Node.js using a **Clean Architecture approach**, integrating multiple databases, authentication flows, caching, and an event-driven system.

---

## 📌 Overview

This project demonstrates a real-world backend architecture that combines:

- REST API with Express.js
- PostgreSQL for core relational data
- MongoDB for activity logging
- Redis for caching and temporary storage
- Apache Kafka for event-driven communication
- JWT Authentication with 2FA and password reset flow
- Docker Compose for service orchestration

---

## 🏗️ Architecture

The project follows a **layered Clean Architecture structure**:

```
src/
├── config/
├── controllers/
├── services/
├── repositories/
├── routes/
├── middleware/
├── db/
├── kafka/
├── models/
├── utils/
```

### Flow:

```
Route → Controller → Service → Repository → Database
```

---

## 🛠️ Tech Stack

- Node.js (ES Modules)
- Express.js
- PostgreSQL (pg)
- MongoDB (mongoose)
- Redis
- Kafka (kafkajs)
- JWT (jsonwebtoken)
- Nodemailer
- Docker / Docker Compose

---

## 🔐 Authentication Features

- User Registration
- Login with Email + Password
- 2FA verification (email-based)
- JWT Access Token (short-lived)
- Refresh Token (httpOnly cookie)
- Forgot Password (email reset link)
- Reset Password (token-based)
- Logout (invalidates refresh token)
- Get current user (`/me`)
- Update profile (`/profile`)

---

## 🔒 Authorization & Security

- Protected routes using JWT middleware
- Role-based access control (admin / user)
- Only authenticated users can:
  - create posts
  - update posts
  - delete posts
- Ownership-based authorization:
  - users can only modify their own posts
- Admin-only access:
  - full activity logs

---

## ⚡ Event-Driven System (Kafka)

Kafka is used for decoupled event processing.

### Events published:

- USER_REGISTERED
- LOGIN_2FA_SENT
- USER_LOGGED_IN
- LOGIN_FAILED
- PASSWORD_RESET_REQUESTED
- PASSWORD_RESET_COMPLETED
- USER_LOGGED_OUT
- PROFILE_UPDATED
- POST_CREATED
- POST_UPDATED
- POST_DELETED

### Flow:

```
Post/Auth Action → Kafka Producer → Kafka Topic → Consumer → MongoDB Logs
```

---

## 📊 Activity Logs (MongoDB)

All important system actions are stored in MongoDB.

```
Database: activityLog
Collection: activitylogs
```

Each log contains:

- action
- userId
- postId (optional)
- message
- timestamps

### Endpoints:

- GET `/api/activity-logs` → admin only
- GET `/api/activity-logs/my-logs` → current user only

---

## 🧠 Caching & Tokens (Redis)

Redis is used for:

- 2FA codes → `2fa:email`
- Password reset tokens → `reset:token`
- Refresh tokens → `refresh:userId`
- Optional caching layer for performance

---

## 🗄️ Databases

### PostgreSQL

Stores:

- users
- posts

### MongoDB

Stores:

- activity logs

### Redis

Stores:

- temporary/authentication data

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=app_db

MONGO_URI=mongodb://localhost:27017/activityLog

KAFKA_BROKER=localhost:9092
KAFKA_CLIENT_ID=backend-app
KAFKA_TOPIC_POSTS=post-events
KAFKA_GROUP_ID=post-events-group
KAFKAJS_NO_PARTITIONER_WARNING=1

REDIS_URL=redis://127.0.0.1:6379

FRONTEND_ORIGIN=http://localhost:3000

JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES_IN=15m

JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

TWO_FA_EXPIRES_SECONDS=300
RESET_PASSWORD_EXPIRES_SECONDS=600

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM=your_email@gmail.com
```

---

## ▶️ Running the Project

### 1. Install dependencies

```bash
npm install
```

### 2. Start services with Docker Compose

```bash
docker compose up -d
```

### 3. Start backend server

```bash
npm start
```

---

## 🧪 API Endpoints

### Auth

- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/verify-2fa`
- POST `/api/auth/refresh-token`
- POST `/api/auth/forgot-password`
- POST `/api/auth/reset-password`
- POST `/api/auth/logout`
- GET `/api/auth/me`
- PUT `/api/auth/profile`

---

### Posts

- POST `/api/posts` (auth required)
- GET `/api/posts`
- GET `/api/posts/my-posts` (auth required)
- PUT `/api/posts/:id` (owner/admin)
- DELETE `/api/posts/:id` (owner/admin)

---

### Activity Logs

- GET `/api/activity-logs` (admin only)
- GET `/api/activity-logs/my-logs` (auth required)

---

## 🧪 Testing

Use Postman to test endpoints.

### Recommended flow:

1. Register user
2. Login
3. Verify 2FA
4. Get access token
5. Test protected routes
6. Create/update/delete posts
7. Check logs in MongoDB
8. Test admin vs user access

---

## 📈 Key Concepts Demonstrated

- Clean Architecture
- Separation of concerns
- Event-driven architecture (Kafka)
- Multi-database integration
- Authentication & authorization
- Token-based security (JWT + refresh tokens)
- Redis caching strategies
- Activity logging / audit trail
- Docker-based development setup

---

## 💡 Notes

- Backend-only project (no frontend required)
- Designed for learning and real-world backend practices
- Kafka may show temporary rebalancing in local Docker setup (normal behavior)
- Easily extendable with:
  - roles/permissions system
  - frontend integration
  - microservices

---

## 👨‍💻 Author

**Getuar Jakupi**  
Computer Science & Engineering Student  
Full-Stack Developer 🚀
Email: getuar.j1@gmail.com
