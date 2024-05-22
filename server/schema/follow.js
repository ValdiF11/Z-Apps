const typeDefs = `#graphql
    type Follow {
        _id: ID
        followingId: ID
        followerId: ID
        createdAt: String
        updatedAt: String
        followers:Followers
        following:Following
    }

    type Followers {
        username: String
    }

    type Following {
        username: String
    }

    type succesFollow {
        message: String
    }

    type Query {
        getFollowers(_id:ID): [Follow]
        getFollowing(_id:ID): [Follow]
        findFollowStatus(_id:ID):Boolean
    }

    type Mutation {
        addFollowers(targetID:ID): succesFollow
    }
`;

module.exports = typeDefs;
