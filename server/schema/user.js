const typeDefs = `#graphql
    type User {
        _id: ID
        name: String
        username: String
        imgUrl:String
        email: String
        password: String
    }

    type UserDetail {
        _id: ID
        name: String
        username: String
        imgUrl:String
        email: String
        password: String
        followers: [follow]
        following: [follow]
    }
    
    type follow {
        _id: ID
        followingId: ID
        followerId: ID
        createdAt: String
        updatedAt: String
        details: detail
    }

    type detail{
        _id: ID
        name: String
        username: String
        email: String
        imgUrl:String
    }

    type LoginOk {
        access_token: String
        email: String
    }

    type Query {
        getUsers: [User]
        getUserById(_id:ID!): UserDetail
        searchUser(searchTerm:String!):[User]
        getUserLogin:UserDetail
    }

    input PostUser {
        name: String!
        username: String!
        email: String!
        password: String!
        imgUrl:String
    }

    input Login {
        email: String!
        password: String!

    }

    type Mutation {
          addUser(newUser: PostUser): UserDetail
          login(newLogin: Login): LoginOk
    }
`;

module.exports = typeDefs;
