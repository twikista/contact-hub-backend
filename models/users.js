const mongoose = require("mongoose");

const userAvatarSchema = mongoose.Schema({
  publicId: String,
  url: String,
});

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: userAvatarSchema,
});

module.exports = mongoose("User", userSchema);
