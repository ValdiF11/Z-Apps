const redis = require("../config/redis");
const { checkNotEmpty } = require("../helper/validation");
const Post = require("../model/post");

const resolvers = {
  Query: {
    findAllPost: async () => {
      const posts = await redis.get("posts");
      if (posts) {
        return JSON.parse(posts);
      }
      const data = await Post.findPosts();
      await redis.set("posts", JSON.stringify(data));
      return data;
    },
    findPostById: async (_, args) => {
      const { _id } = args;
      const data = await Post.findAPost(_id);
      return data;
    },
  },
  Mutation: {
    addPost: async (_, args, contextValue) => {
      const auth = contextValue.authentication();
      const { content, tags, imgUrl } = args.newPost;
      checkNotEmpty(content, "Content");
      const data = await Post.createPost({
        content,
        imgUrl,
        tags,
        authorId: auth._id,
      });
      await redis.del("posts");
      const result = await Post.findAPost(data.insertedId);
      return result;
    },
    addComment: async (_, args, contextValue) => {
      const auth = contextValue.authentication();
      const { _id, content } = args.newComment;
      checkNotEmpty(content, "Content");
      await Post.createComment({
        _id,
        content,
        username: auth.username,
      });
      await redis.del("posts");
      const result = await Post.findAPost(_id);
      return result;
    },
    addLike: async (_, args, contextValue) => {
      const auth = contextValue.authentication();
      const { _id } = args;
      await Post.createLike({
        _id,
        username: auth.username,
      });
      await redis.del("posts");
      const result = await Post.findAPost(_id);
      return result;
    },
  },
};

module.exports = resolvers;
