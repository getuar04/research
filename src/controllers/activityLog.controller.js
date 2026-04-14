import { getAllActivityLogsRepo  } from "../repositories/activityLog.repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllActivityLogs = asyncHandler(async (req, res) => {
  const logs = await getAllActivityLogsRepo();

  return res.status(200).json({
    success: true,
    data: logs,
  });
});
