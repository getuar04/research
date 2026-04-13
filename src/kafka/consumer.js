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

      const supportedActions = [
        "POST_CREATED",
        "POST_UPDATED",
        "POST_DELETED",
        "USER_REGISTERED",
        "LOGIN_2FA_SENT",
        "USER_LOGGED_IN",
        "LOGIN_FAILED",
        "PASSWORD_RESET_REQUESTED",
        "PASSWORD_RESET_COMPLETED",
        "USER_LOGGED_OUT",
        "PROFILE_UPDATED",
        "TOKEN_REFRESHED",
      ];

      if (
        !supportedActions.includes(event.action) &&
        !supportedActions.includes(event.eventType)
      ) {
        return;
      }

      await createActivityLogRepo({
        action: event.action || event.eventType,
        userId: event.userId || null,
        postId: event.postId || null,
        message: event.message,
      });
    },
  });
};
