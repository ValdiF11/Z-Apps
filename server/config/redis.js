const Redis = require("ioredis");

const redis = new Redis({
  port: 14970, // Redis port
  host: process.env.REDIS_EP, // Redis host
  username: "default", // needs Redis >= 6
  password: process.env.REDIS_PASS,
});

module.exports = redis;
