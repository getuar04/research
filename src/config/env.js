import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT),

  dbHost: process.env.DB_HOST,
  dbPort: Number(process.env.DB_PORT),
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,

  mongoUri: process.env.MONGO_URI,

  kafkaBroker: process.env.KAFKA_BROKER,
  kafkaClientId: process.env.KAFKA_CLIENT_ID,
  kafkaTopicPosts: process.env.KAFKA_TOPIC_POSTS,
  kafkaGroupId: process.env.KAFKA_GROUP_ID,
  kafkaNoPartitionerWarning: process.env.KAFKAJS_NO_PARTITIONER_WARNING,

  redisUrl: process.env.REDIS_URL,

  frontendOrigin: process.env.FRONTEND_ORIGIN,

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,

  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,

  twoFaExpiresSeconds: Number(process.env.TWO_FA_EXPIRES_SECONDS),
  resetPasswordExpiresSeconds: Number(
    process.env.RESET_PASSWORD_EXPIRES_SECONDS,
  ),

  mailHost: process.env.MAIL_HOST,
  mailPort: Number(process.env.MAIL_PORT),
  mailUser: process.env.MAIL_USER,
  mailPass: process.env.MAIL_PASS,
  mailFrom: process.env.MAIL_FROM,

  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
};
