import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,

  dbHost: process.env.DB_HOST,
  dbPort: Number(process.env.DB_PORT) || 5432,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,

  mongoUri: process.env.MONGO_URI,

  kafkaBroker: process.env.KAFKA_BROKER,
  kafkaClientId: process.env.KAFKA_CLIENT_ID,
  kafkaTopicPosts: process.env.KAFKA_TOPIC_POSTS,
  kafkaGroupId: process.env.KAFKA_GROUP_ID,
};
