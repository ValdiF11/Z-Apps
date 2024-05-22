const { hashPassword, comparePassword } = require("../helper/bycript");
const { createToken, verifyToken } = require("../helper/jwt");
const { GraphQLError } = require("graphql");
const User = require("../model/user");
const { validateEmailFormat, checkNotEmpty, checkPasswordLength, checkDuplicateEmail, checkDuplicateUsername } = require("../helper/validation");

const resolvers = {
  Query: {
    getUsers: async () => {
      const data = await User.findUsers();
      return data;
    },
    getUserById: async (_, args) => {
      const { _id } = args;
      const data = await User.findAUser(_id);
      console.log(data);
      return data;
    },
    searchUser: async (_, args) => {
      const { searchTerm } = args;
      const data = await User.search(searchTerm);
      console.log(data);
      return data;
    },
    getUserLogin: async (_, args, contextValue) => {
      const auth = contextValue.authentication();
      const _id = auth._id;
      const data = await User.findAUser(_id);
      console.log(data);
      return data;
    },
  },
  Mutation: {
    addUser: async (_, args) => {
      const { name, username, email, password, imgUrl } = args.newUser;
      // validation for item not empty and null
      checkNotEmpty(name, "Name");
      checkNotEmpty(username, "Username");
      checkNotEmpty(email, "Email");
      checkNotEmpty(password, "Password");
      // validation for email format
      validateEmailFormat(email);
      // validation for password -5 char
      checkPasswordLength(password);
      // validation for unique email
      await checkDuplicateEmail(email);
      // validation for unique email
      await checkDuplicateUsername(username);
      const data = await User.addUser({
        name,
        username,
        email,
        password: hashPassword(password),
        imgUrl,
      });
      console.log(data);
      const result = await User.findAUser(data.insertedId);
      return result;
    },
    login: async (_, args) => {
      const { email, password } = args.newLogin;
      const user = await User.findUserByEmail(email);
      if (!user) {
        throw new GraphQLError("Invalid email/password", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }
      const isPasswordValid = comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new GraphQLError("Invalid email/password", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }
      const access_token = createToken({
        _id: user._id,
        email: user.email,
        username: user.username,
      });
      return {
        access_token,
        email,
      };
    },
  },
};

module.exports = resolvers;
