export const makeCreatePostUseCase = ({
  postRepository,
  postCacheRepository,
  postEventPublisher,
}) => {
  return async ({ title, content, user }) => {
    if (!title) {
      throw new Error("Title is required");
    }

    if (!user?.id) {
      throw new Error("User not found");
    }

    const post = await postRepository.create({
      title,
      content,
      userId: user.id,
    });

    await postCacheRepository.invalidateAll();
    await postCacheRepository.invalidateByUserId(user.id);

    await postEventPublisher.publishCreated({
      post,
      user,
    });

    return post;
  };
};
