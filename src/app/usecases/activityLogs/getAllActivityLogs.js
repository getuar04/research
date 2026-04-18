export const makeGetAllActivityLogsUseCase = ({ activityLogRepository }) => {
  return async () => {
    return await activityLogRepository.getAll();
  };
};
