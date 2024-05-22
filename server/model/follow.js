const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

class Follow {
  static collection() {
    return database.collection("follows");
  }
  static async findFollowing(_id) {
    return this.collection()
      .aggregate([
        {
          $match: {
            followerId: new ObjectId(String(_id)),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "followingId",
            foreignField: "_id",
            as: "following",
          },
        },
        {
          $unwind: {
            path: "$following",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            "following.password": 0,
          },
        },
      ])
      .toArray();
  }

  static async findfollowers(_id) {
    return this.collection()
      .aggregate([
        {
          $match: {
            followingId: new ObjectId(String(_id)),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "followersId",
            foreignField: "_id",
            as: "followers",
          },
        },
        {
          $unwind: {
            path: "$followers",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            "followers.password": 0,
          },
        },
      ])
      .toArray();
  }

  static async createFollow(newFollow) {
    return this.collection().insertOne({
      ...newFollow,
      followingId: new ObjectId(String(newFollow.followingId)),
      followerId: new ObjectId(String(newFollow.followerId)),
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    });
  }
}

module.exports = Follow;
