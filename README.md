# 🚀 Backend Research Project (Node.js)

A modern backend system built with Node.js using a **Clean Architecture approach**, integrating multiple databases and an event-driven system.

---

## 📌 Overview

This project demonstrates a real-world backend architecture that combines:

- REST API with Express.js
- PostgreSQL for relational data
- MongoDB for activity logging
- Redis for caching and temporary storage
- Apache Kafka for event-driven communication
- JWT Authentication with 2FA and password reset flow

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
- Docker

---

## 🔐 Authentication Features

- User Registration
- Login with 2FA (email-based)
- JWT Access Token
- Refresh Token (httpOnly cookie)
- Forgot Password (reset link via email)
- Reset Password (token-based)
- Logout
- Profile update (`/me`, `/profile`)

---

## ⚡ Event-Driven System (Kafka)

The system uses Kafka to publish and consume events.

### Examples of events:

- USER_REGISTERED
- LOGIN_2FA_SENT
- USER_LOGGED_IN
- LOGIN_FAILED
- PASSWORD_RESET_REQUESTED
- PASSWORD_RESET_COMPLETED
- USER_LOGGED_OUT
- PROFILE_UPDATED
- POST_CREATED / UPDATED / DELETED

---

## 📊 Activity Logs (MongoDB)

All important system actions are stored in MongoDB:

```
Database: activityLog
Collection: activitylogs
```

Each log includes:

- action
- userId
- postId (optional)
- message
- timestamps

---

## 🧠 Caching (Redis)

Redis is used for:

- 2FA codes (`2fa:email`)
- Password reset tokens (`reset:token`)
- Refresh tokens (`refresh:userId`)
- User caching (`users:all`, `users:id`)

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

- temporary/auth data

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

### 2. Start services with Docker

```bash
docker run -d --name kafka -p 9092:9092 apache/kafka:4.2.0
docker run -d --name redis -p 6379:6379 redis
```

### 3. Start server

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

### Posts

- POST `/api/posts`
- GET `/api/posts`
- PUT `/api/posts/:id`
- DELETE `/api/posts/:id`

### Activity Logs

- GET `/api/activity-logs`

---

## 📬 Testing

Use Postman to test all endpoints.

Typical flow:

1. Register
2. Login
3. Verify 2FA
4. Use access token
5. Test protected routes
6. Check activity logs

---

## 📈 Key Concepts Demonstrated

- Clean Architecture
- Separation of concerns
- Event-driven systems (Kafka)
- Multi-database architecture
- Authentication & security
- Caching strategies
- Audit logging

---

## 💡 Notes

- This project is backend-only (no frontend required)
- Designed for learning and real-world backend practices
- Can be extended with roles (admin/user) in future

---

## 👨‍💻 Author

Getuar Jakupi
Computer Science & Engineering Student
Full-Stack Developer
