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
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: userAvatarSchema,
});

userSchema.virtual("fullName").get(function () {
  if (this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }

  if (!this.lastName) {
    return `${this.firstName}`;
  }
});

module.exports = mongoose.model("User", userSchema);
