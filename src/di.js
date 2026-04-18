import { makeGetAllActivityLogsUseCase } from "./app/usecases/activityLogs/getAllActivityLogs.js";

import { makeGetAllPostsUseCase } from "./app/usecases/posts/getAllPosts.js";
import { makeGetPostByIdUseCase } from "./app/usecases/posts/getPostById.js";
import { makeGetMyPostsUseCase } from "./app/usecases/posts/getMyPosts.js";
import { makeCreatePostUseCase } from "./app/usecases/posts/createPost.js";
import { makeUpdatePostUseCase } from "./app/usecases/posts/updatePost.js";
import { makeDeletePostUseCase } from "./app/usecases/posts/deletePost.js";

import { mongoActivityLogRepository } from "./infra/mongo/repositories/activityLogRepository.js";
import { postgresPostRepository } from "./infra/postgres/repositories/postRepository.js";
import { redisPostCacheRepository } from "./infra/redis/repositories/postCacheRepository.js";
import { kafkaPostEventPublisher } from "./infra/kafka/producers/postEventPublisher.js";

export const getAllActivityLogsUseCase = makeGetAllActivityLogsUseCase({
  activityLogRepository: mongoActivityLogRepository,
});

export const getAllPostsUseCase = makeGetAllPostsUseCase({
  postRepository: postgresPostRepository,
  postCacheRepository: redisPostCacheRepository,
});

export const getPostByIdUseCase = makeGetPostByIdUseCase({
  postRepository: postgresPostRepository,
  postCacheRepository: redisPostCacheRepository,
});

export const getMyPostsUseCase = makeGetMyPostsUseCase({
  postRepository: postgresPostRepository,
  postCacheRepository: redisPostCacheRepository,
});

export const createPostUseCase = makeCreatePostUseCase({
  postRepository: postgresPostRepository,
  postCacheRepository: redisPostCacheRepository,
  postEventPublisher: kafkaPostEventPublisher,
});

export const updatePostUseCase = makeUpdatePostUseCase({
  postRepository: postgresPostRepository,
  postCacheRepository: redisPostCacheRepository,
  postEventPublisher: kafkaPostEventPublisher,
});

export const deletePostUseCase = makeDeletePostUseCase({
  postRepository: postgresPostRepository,
  postCacheRepository: redisPostCacheRepository,
  postEventPublisher: kafkaPostEventPublisher,
});
