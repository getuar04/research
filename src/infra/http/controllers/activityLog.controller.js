import { asyncHandler } from "../../../utils/asyncHandler.js";
import { getAllActivityLogsUseCase } from "../../../di.js";

export const getAllActivityLogs = asyncHandler(async (req, res) => {
  const logs = await getAllActivityLogsUseCase();

  return res.status(200).json({
    success: true,
    data: logs,
  });
});
