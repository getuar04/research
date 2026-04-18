export const makeGetMyPostsUseCase = ({
  postRepository,
  postCacheRepository,
}) => {
  return async (userId) => {
    if (!userId || Number.isNaN(Number(userId))) {
      throw new Error("Invalid user id");
    }

    const numericUserId = Number(userId);

    const cachedPosts = await postCacheRepository.getByUserId(numericUserId);
    if (cachedPosts) {
      return cachedPosts;
    }

    const posts = await postRepository.getByUserId(numericUserId);
    await postCacheRepository.setByUserId(numericUserId, posts);

    return posts;
  };
};
