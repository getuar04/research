import { kafka } from "./client.js";
import { env } from "../config/env.js";

const admin = kafka.admin();

export const setupKafka = async () => {
  await admin.connect();
  console.log("Kafka admin connected");

  const topics = await admin.listTopics();

  if (!topics.includes(env.kafkaTopicPosts)) {
    await admin.createTopics({
      topics: [
        {
          topic: env.kafkaTopicPosts,
          numPartitions: 1,
          replicationFactor: 1,
        },
      ],
    });

    console.log(`Kafka topic created: ${env.kafkaTopicPosts}`);
  } else {
    console.log(`Kafka topic already exists: ${env.kafkaTopicPosts}`);
  }

  await admin.disconnect();
};
