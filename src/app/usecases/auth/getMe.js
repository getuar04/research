export const makeGetMeUseCase = ({ authRepository }) => {
  return async (userId) => {
    if (!userId) {
      throw new Error("User not found");
    }

    const user = await authRepository.getById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  };
};
