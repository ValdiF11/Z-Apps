const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

class Post {
  static collection() {
    return database.collection("posts");
  }
  static async findPosts() {
    return this.collection()
      .aggregate([
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
            preserveNullAndEmptyArrays: false,
          },
        },
      ])
      .toArray();
  }
  static async findAPost(_id) {
    const data = await this.collection()
      .aggregate([
        {
          $match: {
            _id: new ObjectId(String(_id)),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ])
      .toArray();
    return data[0];
  }
  static async createPost(newPost) {
    return this.collection().insertOne({
      ...newPost,
      authorId: new ObjectId(String(newPost.authorId)),
      comments: [],
      likes: [],
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    });
  }
  static async createComment(newComment) {
    return this.collection().updateOne(
      { _id: new ObjectId(String(newComment._id)) },
      {
        $push: {
          comments: {
            $each: [
              {
                username: newComment.username,
                content: newComment.content,
                createdAt: new Date().toString(),
                updatedAt: new Date().toString(),
              },
            ],
            $sort: { createdAt: -1 },
          },
        },
      }
    );
  }
  static async createLike(newLike) {
    const post = await this.findAPost(newLike._id);
    const isLike = post.likes.finds((element) => element.username === username);
    if (!isLike) {
      return this.collection().updateOne(
        { _id: new ObjectId(String(newLike._id)) },
        {
          $push: {
            likes: {
              $each: [
                {
                  username: newLike.username,
                  createdAt: new Date().toString(),
                  updatedAt: new Date().toString(),
                },
              ],
              $sort: { createdAt: -1 },
            },
          },
        }
      );
    } else {
      return this.collection().updateOne(
        { _id: new ObjectId(String(newLike._id)) },
        {
          $pull: {
            likes: {
              username,
            },
          },
        }
      );
    }
  }
}

module.exports = Post;
