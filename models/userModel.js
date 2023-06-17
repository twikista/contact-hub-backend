const mongoose = require('mongoose')

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
  passwordHash: {
    type: String,
    required: true,
  },
  avatar: {
    publicId: String,
    url: String,
  },
})

userSchema.virtual('fullName').get(function () {
  const fullName = this.lastName
    ? `${this.firstName} ${this.lastName}`
    : `${this.firstName}`
  return fullName

  /*if (this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }

  if (!this.lastName) {
    return `${this.firstName}`;
  }*/
})

module.exports = mongoose.model('User', userSchema)
