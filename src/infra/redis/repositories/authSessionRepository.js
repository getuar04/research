import { redisClient } from "../../../db/redis.js";

export const redisAuthSessionRepository = {
  deleteRefreshTokenByUserId: async (userId) => {
    await redisClient.del(`refresh:${userId}`);
  },
};
