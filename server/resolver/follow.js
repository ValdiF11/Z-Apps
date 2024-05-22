const Follow = require("../model/follow");

const resolvers = {
  Query: {
    getFollowers: async (_, args) => {
      const { _id } = args;
      const data = await Follow.findfollowers(_id);
      return data;
    },
    getFollowing: async (_, args) => {
      const { _id } = args;
      const data = await Follow.findFollowing(_id);
      return data;
    },
  },
  Mutation: {
    addFollowers: async (_, args, contextValue) => {
      const auth = contextValue.authentication();
      const { targetID } = args;
      await Follow.createFollow({
        followingId: targetID,
        followerId: auth._id,
      });
      const result = { message: "follow Succes" };
      return result;
    },
  },
};

module.exports = resolvers;
