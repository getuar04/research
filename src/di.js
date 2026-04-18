import { makeGetAllActivityLogsUseCase } from "./app/usecases/activityLogs/getAllActivityLogs.js";

import { makeGetAllPostsUseCase } from "./app/usecases/posts/getAllPosts.js";
import { makeGetPostByIdUseCase } from "./app/usecases/posts/getPostById.js";
import { makeGetMyPostsUseCase } from "./app/usecases/posts/getMyPosts.js";
import { makeCreatePostUseCase } from "./app/usecases/posts/createPost.js";
import { makeUpdatePostUseCase } from "./app/usecases/posts/updatePost.js";
import { makeDeletePostUseCase } from "./app/usecases/posts/deletePost.js";

import { makeGetMeUseCase } from "./app/usecases/auth/getMe.js";
import { makeUpdateProfileUseCase } from "./app/usecases/auth/updateProfile.js";
import { makeLogoutUseCase } from "./app/usecases/auth/logout.js";

import { mongoActivityLogRepository } from "./infra/mongo/repositories/activityLogRepository.js";

import { postgresPostRepository } from "./infra/postgres/repositories/postRepository.js";
import { postgresAuthRepository } from "./infra/postgres/repositories/authRepository.js";

import { redisPostCacheRepository } from "./infra/redis/repositories/postCacheRepository.js";
import { redisAuthSessionRepository } from "./infra/redis/repositories/authSessionRepository.js";

import { kafkaPostEventPublisher } from "./infra/kafka/producers/postEventPublisher.js";
import { kafkaAuthEventPublisher } from "./infra/kafka/producers/authEventPublisher.js";

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

export const getMeUseCase = makeGetMeUseCase({
  authRepository: postgresAuthRepository,
});

export const updateProfileUseCase = makeUpdateProfileUseCase({
  authRepository: postgresAuthRepository,
  authEventPublisher: kafkaAuthEventPublisher,
});

export const logoutUseCase = makeLogoutUseCase({
  authRepository: postgresAuthRepository,
  authSessionRepository: redisAuthSessionRepository,
  authEventPublisher: kafkaAuthEventPublisher,
});