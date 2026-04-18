import { publishPostEvent } from "../../../kafka/producer.js";

export const kafkaPostEventPublisher = {
  publishCreated: async ({ post, user }) => {
    await publishPostEvent("POST_CREATED", {
      postId: post.id,
      userId: user.id,
      userName: user.name,
      title: post.title,
      message: `Post created: ${post.title}`,
    });
  },

  publishUpdated: async ({ post, user }) => {
    await publishPostEvent("POST_UPDATED", {
      postId: post.id,
      userId: user.id,
      userName: user.name,
      title: post.title,
      message: `Post updated: ${post.title}`,
    });
  },

  publishDeleted: async ({ post, user, originalPost }) => {
    await publishPostEvent("POST_DELETED", {
      postId: post?.id ?? originalPost?.id,
      userId: user.id,
      userName: user.name,
      title: post?.title ?? originalPost?.title,
      message: `Post deleted: ${post?.title ?? originalPost?.title}`,
    });
  },
};
