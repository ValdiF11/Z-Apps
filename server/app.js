if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const { verifyToken } = require("./helper/jwt");
const User = require("./model/user");

const userTypeDefs = require("./schema/user");
const postTypeDefs = require("./schema/post");
const followTypeDefs = require("./schema/follow");

const userResolver = require("./resolver/user");
const postResolver = require("./resolver/post");
const followResolver = require("./resolver/follow");

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolver, postResolver, followResolver],
  //   supaya bisa diakses via sendbox
  introspection: true,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },
  context: async ({ req }) => {
    return {
      authentication: () => {
        const authorizationHeader = req.headers.authorization || "";
        console.log(authorizationHeader);
        if (!authorizationHeader) {
          throw new GraphQLError("Access Token must be valid", {
            extensions: { code: "NOT_AUTHORIZED" },
          });
        }
        const [bearer, token] = authorizationHeader.split(" ");
        console.log(bearer, token);
        if (bearer !== "Bearer") {
          throw new GraphQLError("Access Token must be valid", {
            extensions: { code: "NOT_AUTHORIZED" },
          });
        }
        const payload = verifyToken(token);
        console.log(payload);
        let user = User.findAUser(payload._id);
        if (!user) {
          throw new GraphQLError("Access Token must be valid", {
            extensions: { code: "NOT_AUTHORIZED" },
          });
        }
        return payload;
      },
    };
  },
})
  .then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
  })
  .catch((err) => console.log(err));
