import app from "./src/app.js";
import { env } from "./src/config/env.js";
import { connectPostgres } from "./src/db/postgres.js";
import { connectMongo } from "./src/db/mongo.js";
import { connectRedis } from "./src/db/redis.js";
import { setupKafka } from "./src/kafka/admin.js";
import { connectProducer } from "./src/kafka/producer.js";
import { connectConsumer } from "./src/kafka/consumer.js";

const startServer = async () => {
  await connectPostgres();
  await connectMongo();
  await connectRedis();

  await setupKafka();
  await connectProducer();
  await connectConsumer();

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer();
