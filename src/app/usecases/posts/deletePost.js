export const makeDeletePostUseCase = ({
  postRepository,
  postCacheRepository,
  postEventPublisher,
}) => {
  return async ({ id, user }) => {
    if (!id || Number.isNaN(Number(id))) {
      throw new Error("Invalid post id");
    }

    const numericId = Number(id);
    const existingPost = await postRepository.getById(numericId);

    if (!existingPost) {
      throw new Error("Post not found");
    }

    if (existingPost.user_id !== user.id && user.role !== "admin") {
      throw new Error("Access denied");
    }

    const deletedPost = await postRepository.delete(numericId);

    await postCacheRepository.invalidateAll();
    await postCacheRepository.invalidateById(numericId);
    await postCacheRepository.invalidateByUserId(existingPost.user_id);

    await postEventPublisher.publishDeleted({
      post: deletedPost,
      user,
      originalPost: existingPost,
    });

    return deletedPost;
  };
};
