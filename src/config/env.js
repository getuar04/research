import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,

  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT) || 5432,
  dbUser: process.env.DB_USER || "postgres",
  dbPassword: process.env.DB_PASSWORD || "",
  dbName: process.env.DB_NAME || "app_db",

  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/activityLog",

  kafkaBroker: process.env.KAFKA_BROKER || "localhost:9092",
  kafkaClientId: process.env.KAFKA_CLIENT_ID || "backend-app",
  kafkaTopicPosts: process.env.KAFKA_TOPIC_POSTS || "post-events",
  kafkaGroupId: process.env.KAFKA_GROUP_ID || "post-events-group",
  kafkaNoPartitionerWarning: process.env.KAFKAJS_NO_PARTITIONER_WARNING || "1",

  redisUrl: process.env.REDIS_URL || "redis://127.0.0.1:6379",

  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",

  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  twoFaExpiresSeconds: Number(process.env.TWO_FA_EXPIRES_SECONDS) || 300,
  resetPasswordExpiresSeconds:
    Number(process.env.RESET_PASSWORD_EXPIRES_SECONDS) || 600,

  mailHost: process.env.MAIL_HOST || "",
  mailPort: Number(process.env.MAIL_PORT) || 587,
  mailUser: process.env.MAIL_USER || "",
  mailPass: process.env.MAIL_PASS || "",
  mailFrom: process.env.MAIL_FROM || "",
};
