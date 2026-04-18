export const makeUpdatePostUseCase = ({
  postRepository,
  postCacheRepository,
  postEventPublisher,
}) => {
  return async ({ id, title, content, user }) => {
    if (!id || Number.isNaN(Number(id))) {
      throw new Error("Invalid post id");
    }

    if (!title) {
      throw new Error("Title is required");
    }

    const numericId = Number(id);
    const existingPost = await postRepository.getById(numericId);

    if (!existingPost) {
      throw new Error("Post not found");
    }

    if (existingPost.user_id !== user.id && user.role !== "admin") {
      throw new Error("Access denied");
    }

    const updatedPost = await postRepository.update({
      id: numericId,
      title,
      content,
    });

    await postCacheRepository.invalidateAll();
    await postCacheRepository.invalidateById(numericId);
    await postCacheRepository.invalidateByUserId(existingPost.user_id);

    await postEventPublisher.publishUpdated({
      post: updatedPost,
      user,
      originalPost: existingPost,
    });

    return updatedPost;
  };
};
