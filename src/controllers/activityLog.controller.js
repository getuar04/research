import { getAllActivityLogsService } from "../services/activityLog.service.js";

export const getAllActivityLogs = async (req, res) => {
  try {
    const logs = await getAllActivityLogsService();

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
