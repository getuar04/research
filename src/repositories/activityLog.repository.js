import ActivityLog from "../models/activityLog.model.js";

export const createActivityLogRepo = async (data) => {
  return await ActivityLog.create(data);
};

export const getAllActivityLogsRepo = async () => {
  return await ActivityLog.find().sort({ createdAt: -1 });
};
