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
      try {
        const rawValue = message.value?.toString();

        if (!rawValue) return;

        const event = JSON.parse(rawValue);

        const action = event.action || event.eventType;
        if (!action) return;

        const logMessage =
          event.message ||
          (() => {
            if (action === "POST_CREATED") {
              return `User ${event.userName || "Unknown"} created post ${event.title || ""}`.trim();
            }

            if (action === "POST_UPDATED") {
              return `User ${event.userName || "Unknown"} updated post ${event.title || ""}`.trim();
            }

            if (action === "POST_DELETED") {
              return `Post ${event.title || ""} was deleted`.trim();
            }

            if (action === "USER_REGISTERED") {
              return `User ${event.email || ""} registered`.trim();
            }

            if (action === "LOGIN_2FA_SENT") {
              return `2FA code sent to ${event.email || ""}`.trim();
            }

            if (action === "USER_LOGGED_IN") {
              return `User ${event.email || ""} logged in successfully`.trim();
            }

            if (action === "LOGIN_FAILED") {
              return `Failed login attempt for ${event.email || ""}`.trim();
            }

            if (action === "PASSWORD_RESET_REQUESTED") {
              return `Password reset requested for ${event.email || ""}`.trim();
            }

            if (action === "PASSWORD_RESET_COMPLETED") {
              return `Password reset completed for ${event.email || ""}`.trim();
            }

            if (action === "USER_LOGGED_OUT") {
              return `User logged out`;
            }

            if (action === "PROFILE_UPDATED") {
              return `Profile updated for ${event.email || ""}`.trim();
            }

            if (action === "TOKEN_REFRESHED") {
              return `Access token refreshed for ${event.email || ""}`.trim();
            }

            return "System activity recorded";
          })();

        await createActivityLogRepo({
          action,
          userId: event.userId || null,
          postId: event.postId || null,
          message: logMessage,
        });
      } catch (error) {
        console.error(
          "Kafka consumer message processing error:",
          error.message,
        );
      }
    },
  });
};
