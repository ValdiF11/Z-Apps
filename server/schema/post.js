const typeDefs = `#graphql
    type Post {
        _id: ID
        content: String
        tags: [String]
        imgUrl: String
        authorId: String
        comments: [Comment]
        likes: [Like]
        createdAt: String
        updatedAt: String
        author: Author
    }

    type Author {
        _id: ID
        name: String
        email: String
        username:String
        imgUrl:String
    }

    type Comment {
        content: String
        username: String
        createdAt: String
        updatedAt: String
    }

    type Like {
        username: String
        createdAt: String
        updatedAt: String
    }

    input PostInput {
        content: String!
        tags: [String!]
        imgUrl: String!
    }

    input CommentInput {
        _id: ID!
        content: String!
    }

    type Query {
        findAllPost: [Post]
        findPostById(_id:ID!): Post
    }
    
    type Mutation {
    addPost(newPost: PostInput): Post
    addComment(newComment: CommentInput): Post
    addLike(_id:ID!):Post
}
    
`;

module.exports = typeDefs;
