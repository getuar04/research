export const makeUpdateProfileUseCase = ({
  authRepository,
  authEventPublisher,
}) => {
  return async ({ userId, name }) => {
    if (!userId) {
      throw new Error("User not found");
    }

    if (!name) {
      throw new Error("Name is required");
    }

    const existingUser = await authRepository.getByIdWithPassword(userId);

    if (!existingUser) {
      throw new Error("User not found");
    }

    const updatedUser = await authRepository.updateProfile(userId, name);

    await authEventPublisher.publishProfileUpdated({
      userId,
      name: updatedUser.name,
      email: updatedUser.email,
    });

    return updatedUser;
  };
};
