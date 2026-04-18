import { sendEvent } from "../../../kafka/producer.js";

const AUTH_EVENTS_TOPIC = "post-events";

export const kafkaAuthEventPublisher = {
  publishLogout: async ({ userId, name, email }) => {
    await sendEvent(AUTH_EVENTS_TOPIC, {
      action: "USER_LOGOUT",
      userId,
      userName: name || email || "Unknown User",
      message: `User logged out: ${email}`,
    });
  },

  publishProfileUpdated: async ({ userId, name, email }) => {
    await sendEvent(AUTH_EVENTS_TOPIC, {
      action: "PROFILE_UPDATED",
      userId,
      userName: name || email || "Unknown User",
      message: `Profile updated: ${email}`,
    });
  },
};