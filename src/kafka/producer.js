import { kafka } from "./client.js";
import { env } from "../config/env.js";

export const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log("Kafka producer connected");
};

export const publishPostEvent = async (eventType, payload) => {
  await producer.send({
    topic: env.kafkaTopicPosts,
    messages: [
      {
        key: String(payload.postId),
        value: JSON.stringify({
          eventType,
          ...payload,
          createdAt: new Date().toISOString(),
        }),
      },
    ],
  });
};

export const sendEvent = async (topic, message) => {
  await producer.send({
    topic,
    messages: [
      {
        value: JSON.stringify(message),
      },
    ],
  });
};
