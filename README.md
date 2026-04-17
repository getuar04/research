# 🚀 Backend Research Project (Node.js)

A modern backend system built with Node.js using a **Clean Architecture approach**, integrating multiple databases, authentication flows, caching, and an event-driven system. The project also includes a complete DevOps setup with Docker, Kubernetes, and a Jenkins CI/CD pipeline.

---

## 📌 Overview

This project demonstrates a real-world backend architecture that combines:

- REST API with Express.js
- PostgreSQL for core relational data
- MongoDB for activity logging
- Redis for caching and temporary storage
- Apache Kafka for event-driven communication
- JWT Authentication with 2FA and password reset flow
- Docker & Kubernetes for containerization and orchestration
- Jenkins CI/CD pipeline for automated builds and deployments

---

## 🏗️ Architecture

The project follows a **layered Clean Architecture structure**:

```
src/
├── config/           # Environment configuration
├── controllers/      # Request handlers
├── services/         # Business logic
├── repositories/     # Database queries
├── routes/           # API route definitions
├── middleware/       # Auth, validation, error handling
├── db/               # Database connections
├── kafka/            # Kafka producer/consumer
├── models/           # MongoDB models
└── utils/            # Helpers (JWT, mail, async)
```

### Flow

```
Route → Controller → Service → Repository → Database
```

---

## 🛠️ Tech Stack

| Category         | Technology              |
| ---------------- | ----------------------- |
| Runtime          | Node.js (ES Modules)    |
| Framework        | Express.js              |
| Primary Database | PostgreSQL (pg)         |
| Activity Logs    | MongoDB (mongoose)      |
| Caching & Tokens | Redis                   |
| Event Streaming  | Apache Kafka (kafkajs)  |
| Authentication   | JWT + 2FA + Nodemailer  |
| Containerization | Docker & Docker Compose |
| Orchestration    | Kubernetes (kubectl)    |
| CI/CD            | Jenkins Pipeline        |

---

## 🔐 Authentication Features

- User Registration
- Login with Email + Password
- 2FA verification (email-based OTP)
- JWT Access Token (short-lived, 15 minutes)
- Refresh Token (httpOnly cookie, 7 days)
- Forgot Password (email reset link)
- Reset Password (token-based)
- Logout (invalidates refresh token in Redis)
- Get current user (`/me`)
- Update profile (`/profile`)

---

## 🔒 Authorization & Security

- Protected routes using JWT middleware
- Role-based access control (admin / user)
- Only authenticated users can create, update, and delete posts
- Ownership-based authorization — users can only modify their own posts
- Admin-only access to full activity logs

---

## ⚡ Event-Driven System (Kafka)

Kafka is used for decoupled event processing. All major actions publish events to a Kafka topic which are consumed and stored as activity logs in MongoDB.

### Events Published

- `USER_REGISTERED`
- `LOGIN_2FA_SENT`
- `USER_LOGGED_IN`
- `LOGIN_FAILED`
- `PASSWORD_RESET_REQUESTED`
- `PASSWORD_RESET_COMPLETED`
- `USER_LOGGED_OUT`
- `PROFILE_UPDATED`
- `POST_CREATED`
- `POST_UPDATED`
- `POST_DELETED`

### Flow

```
Post/Auth Action → Kafka Producer → Kafka Topic → Consumer → MongoDB Logs
```

---

## 🧠 Caching & Tokens (Redis)

- 2FA codes → `2fa:email` (expires in 5 minutes)
- Password reset tokens → `reset:token` (expires in 10 minutes)
- Refresh tokens → `refresh:userId`
- Optional caching layer for performance

---

## 🗄️ Databases

### PostgreSQL

Stores: users, posts

### MongoDB

Stores: activity logs

### Redis

Stores: temporary/authentication data

---

## 🐳 DevOps & Infrastructure

### Docker

The backend is containerized using Docker. A custom `Dockerfile` uses `node:20-alpine` for a lightweight production image. Jenkins runs as a separate Docker container via Docker Compose.

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
```

---

### Kubernetes

All services are deployed in a Kubernetes cluster using Docker Desktop. Each service runs as a Deployment with a corresponding Service for internal cluster communication.

| Service           | Image               | Port              |
| ----------------- | ------------------- | ----------------- |
| Backend (Node.js) | research-app:latest | NodePort 30007    |
| PostgreSQL        | postgres:16         | 5432 (ClusterIP)  |
| MongoDB           | mongo:7             | 27017 (ClusterIP) |
| Redis             | redis:7-alpine      | 6379 (ClusterIP)  |
| Kafka (KRaft)     | apache/kafka:3.7.0  | 9092 (ClusterIP)  |

#### Kubernetes Configuration

- **ConfigMap** — non-sensitive environment variables (DB_HOST, REDIS_URL, etc.)
- **Secrets** — sensitive variables (DB_PASSWORD, JWT secrets, mail credentials)
- **PersistentVolumeClaims** — data persistence for PostgreSQL and MongoDB
- **InitContainers** — backend waits for PostgreSQL, Redis, and MongoDB before starting
- **ReadinessProbe & LivenessProbe** — health checks on all services

#### Kubernetes Manifests

```
k8s/base/
├── configmap.yaml
├── secrets.yaml
├── postgres-deployment.yaml
├── redis-deployment.yaml
├── mongo-deployment.yaml
├── kafka-deployment.yaml
└── backend-deployment.yaml
```

---

### Jenkins CI/CD Pipeline

Jenkins runs as a Docker container and is integrated with Kubernetes for automated deployments. The pipeline is triggered automatically via GitHub webhook on every push to the `main` branch using ngrok for tunnel exposure.

#### Pipeline Stages

1. **Clean Workspace** — removes old files
2. **Checkout Code** — pulls latest code from GitHub
3. **Install Dependencies** — `npm ci`
4. **Run Tests** — `node --test`
5. **Build Docker Image** — tagged with build number (`research-app:BUILD_NUMBER`)
6. **Deploy to Kubernetes** — `kubectl set image` with new tag
7. **Verify Deploy** — `kubectl get pods`

#### Automated Trigger Flow

```
git push → GitHub → Webhook → ngrok → Jenkins → Build → Deploy → Kubernetes
```

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

### 1. Start Kubernetes Services

```bash
kubectl apply -f k8s/base/secrets.yaml
kubectl apply -f k8s/base/configmap.yaml
kubectl apply -f k8s/base/postgres-deployment.yaml
kubectl apply -f k8s/base/redis-deployment.yaml
kubectl apply -f k8s/base/mongo-deployment.yaml
kubectl apply -f k8s/base/kafka-deployment.yaml
kubectl apply -f k8s/base/backend-deployment.yaml
```

### 2. Start Jenkins

```bash
docker-compose up -d
```

### 3. Configure kubectl for Jenkins

After starting Jenkins, copy the kubeconfig so Jenkins can communicate with the Kubernetes cluster:

```bash
docker exec -u root jenkins mkdir -p /var/jenkins_home/.kube
docker cp "$env:USERPROFILE\.kube\config" jenkins:/var/jenkins_home/.kube/config
docker exec -u root jenkins chown -R jenkins:jenkins /var/jenkins_home/.kube
```

> ⚠️ This step is required every time the Jenkins container is recreated.

### 4. Verify All Pods Running

```bash
kubectl get pods
```

### 5. Test API

```bash
curl http://localhost:30007/
# Expected: {"success":true,"message":"API is running"}
```

---

## 🧪 API Endpoints

### Auth

| Method | Endpoint                    | Access |
| ------ | --------------------------- | ------ |
| POST   | `/api/auth/register`        | Public |
| POST   | `/api/auth/login`           | Public |
| POST   | `/api/auth/verify-2fa`      | Public |
| POST   | `/api/auth/refresh-token`   | Public |
| POST   | `/api/auth/forgot-password` | Public |
| POST   | `/api/auth/reset-password`  | Public |
| POST   | `/api/auth/logout`          | Auth   |
| GET    | `/api/auth/me`              | Auth   |
| PUT    | `/api/auth/profile`         | Auth   |

### Posts

| Method | Endpoint              | Access        |
| ------ | --------------------- | ------------- |
| POST   | `/api/posts`          | Auth          |
| GET    | `/api/posts`          | Public        |
| GET    | `/api/posts/my-posts` | Auth          |
| PUT    | `/api/posts/:id`      | Owner / Admin |
| DELETE | `/api/posts/:id`      | Owner / Admin |

### Activity Logs

| Method | Endpoint                     | Access     |
| ------ | ---------------------------- | ---------- |
| GET    | `/api/activity-logs`         | Admin only |
| GET    | `/api/activity-logs/my-logs` | Auth       |

---

## 🔮 Upcoming Tasks

- **Code Coverage** — integrate `c8`/`nyc` reporting in Jenkins pipeline
- **Google OAuth** — Google authentication integration

---

## 👨‍💻 Author

**Getuar Jakupi**
Computer Science & Engineering Student | Full-Stack Developer 🚀
Email: getuar.j1@gmail.com
