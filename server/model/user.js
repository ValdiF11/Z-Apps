const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");
class User {
  static collection() {
    return database.collection("users");
  }
  static async findUsers() {
    return this.collection()
      .aggregate([
        {
          $unset: "password",
        },
      ])
      .toArray();
  }
  static async findAUser(_id) {
    console.log(_id);
    const data = await this.collection()
      .aggregate([
        {
          $match: {
            _id: new ObjectId(String(_id)),
          },
        },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followingId",
            pipeline: [
              {
                $lookup: {
                  from: "users",
                  localField: "followerId",
                  foreignField: "_id",
                  as: "details",
                },
              },
              {
                $project: {
                  password: 0,
                  email: 0,
                  name: 0,
                },
              },
              {
                $unwind: {
                  path: "$details",
                  preserveNullAndEmptyArrays: false,
                },
              },
            ],
            as: "followers",
          },
        },
        // {
        //   $sort:
        //     {
        //       createdAt: -1,
        //     },
        // }
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followerId",
            pipeline: [
              {
                $lookup: {
                  from: "users",
                  localField: "followingId",
                  foreignField: "_id",
                  as: "details",
                },
              },
              {
                $project: {
                  password: 0,
                  email: 0,
                  name: 0,
                },
              },
              {
                $unwind: {
                  path: "$details",
                  preserveNullAndEmptyArrays: false,
                },
              },
            ],
            as: "following",
          },
        },
        // {
        //   $sort:
        //     {
        //       createdAt: -1,
        //     },
        // }
        {
          $project: {
            password: 0,
          },
        },
      ])
      .toArray();
    return data[0];
  }
  static async findUserByEmail(email) {
    return this.collection().findOne({
      email: email,
    });
  }
  static async findUserByUsername(username) {
    return this.collection().findOne({
      username: username,
    });
  }
  static async search(searchTerm) {
    return this.collection()
      .find({
        $or: [{ name: { $regex: `^${searchTerm}`, $options: "i" } }, { username: { $regex: `^${searchTerm}`, $options: "i" } }],
      })
      .project({ password: 0 })
      .toArray();
  }
  static async addUser(newUser) {
    return this.collection().insertOne(newUser);
  }
}

module.exports = User;
