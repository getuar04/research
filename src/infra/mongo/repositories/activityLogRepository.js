import { getAllActivityLogsRepo } from "../../../repositories/activityLog.repository.js";

export const mongoActivityLogRepository = {
  getAll: async () => {
    return await getAllActivityLogsRepo();
  },
};
