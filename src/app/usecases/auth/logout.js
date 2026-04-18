export const makeLogoutUseCase = ({
  authRepository,
  authSessionRepository,
  authEventPublisher,
}) => {
  return async (userId) => {
    if (!userId) {
      throw new Error("User not found");
    }

    const user = await authRepository.getByIdWithPassword(userId);

    if (!user) {
      throw new Error("User not found");
    }

    await authSessionRepository.deleteRefreshTokenByUserId(userId);

    await authEventPublisher.publishLogout({
      userId: user.id,
      name: user.name,
      email: user.email,
    });

    return {
      message: "Logged out successfully",
    };
  };
};
