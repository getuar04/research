import { kafka } from "./client.js";
import { env } from "../config/env.js";
import { createActivityLogRepo } from "../repositories/activityLog.repository.js";

export const consumer = kafka.consumer({
  groupId: env.kafkaGroupId,
});

export const connectConsumer = async () => {
  await consumer.connect();
  console.log("Kafka consumer connected");

  await consumer.subscribe({
    topic: env.kafkaTopicPosts,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const rawValue = message.value?.toString();

      if (!rawValue) return;

      const event = JSON.parse(rawValue);

      if (event.eventType === "POST_CREATED") {
        await createActivityLogRepo({
          action: "POST_CREATED",
          userId: event.userId,
          postId: event.postId,
          message: `User ${event.userName} created post ${event.title}`,
        });
      }

      if (event.eventType === "POST_UPDATED") {
        await createActivityLogRepo({
          action: "POST_UPDATED",
          userId: event.userId,
          postId: event.postId,
          message: `User ${event.userName} updated post ${event.title}`,
        });
      }

      if (event.eventType === "POST_DELETED") {
        await createActivityLogRepo({
          action: "POST_DELETED",
          userId: event.userId,
          postId: event.postId,
          message: `Post ${event.title} was deleted`,
        });
      }
    },
  });
};
