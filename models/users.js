const mongoose = require("mongoose");

const userAvatarSchema = mongoose.Schema({
  publicId: { type: String, required: true },
  url: { type: String, required: true },
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
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: userAvatarSchema,
});

module.exports = mongoose("User", userSchema);
