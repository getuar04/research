export const makeGetPostByIdUseCase = ({
  postRepository,
  postCacheRepository,
}) => {
  return async (id) => {
    if (!id || Number.isNaN(Number(id))) {
      throw new Error("Invalid post id");
    }

    const numericId = Number(id);

    const cachedPost = await postCacheRepository.getById(numericId);
    if (cachedPost) {
      return cachedPost;
    }

    const post = await postRepository.getById(numericId);

    if (!post) {
      throw new Error("Post not found");
    }

    await postCacheRepository.setById(numericId, post);

    return post;
  };
};
