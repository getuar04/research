export const makeGetAllPostsUseCase = ({
  postRepository,
  postCacheRepository,
}) => {
  return async () => {
    const cachedPosts = await postCacheRepository.getAll();

    if (cachedPosts) {
      return cachedPosts;
    }

    const posts = await postRepository.getAll();
    await postCacheRepository.setAll(posts);

    return posts;
  };
};
