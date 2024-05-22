const { GraphQLError } = require("graphql");
const User = require("../model/user");

function checkNotEmpty(value, fieldName) {
  if (!value || value.trim() === "") {
    throw new GraphQLError(`${fieldName} is required`, {
      extensions: { code: "BAD_REQUEST" },
    });
  }
}

function validateEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new GraphQLError("Invalid email format", {
      extensions: { code: "BAD_REQUEST" },
    });
  }
}

function checkPasswordLength(password) {
  if (password.length < 5) {
    throw new GraphQLError("Password must be at least 5 characters long", {
      extensions: { code: "BAD_REQUEST" },
    });
  }
}

async function checkDuplicateEmail(email) {
  const user = await User.findUserByEmail(email);
  if (user) {
    throw new GraphQLError("Email must be unique", {
      extensions: { code: "BAD_REQUEST" },
    });
  }
}

async function checkDuplicateUsername(username) {
  const user2 = await User.findUserByUsername(username);
  if (user2) {
    throw new GraphQLError("Username must be unique", {
      extensions: { code: "BAD_REQUEST" },
    });
  }
}
module.exports = {
  checkNotEmpty,
  validateEmailFormat,
  checkPasswordLength,
  checkDuplicateEmail,
  checkDuplicateUsername,
};
