import {
  createActivityLogRepo,
  getAllActivityLogsRepo,
} from "../repositories/activityLog.repository.js";

export const createActivityLogService = async (data) => {
  if (!data.action || !data.userId || !data.message) {
    throw new Error("action, userId and message are required");
  }

  return await createActivityLogRepo(data);
};

export const getAllActivityLogsService = async () => {
  return await getAllActivityLogsRepo();
};
