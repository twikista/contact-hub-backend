const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
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
    unique: [true, 'email already in use'],
    validate: {
      validator: (value) => {
        return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
          value
        )
      },
      message: (props) => `${props.value} is not a valid email`,
    },
  },
  passwordHash: {
    type: String,
    required: true,
  },
  avatar: {
    publicId: String,
    url: String,
  },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
})

userSchema.plugin(uniqueValidator)

/*userSchema.virtual('fullName').get(function () {
  const fullName = this.lastName
    ? `${this.firstName} ${this.lastName}`
    : `${this.firstName}`
  return fullName

  /*if (this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }

  if (!this.lastName) {
    return `${this.firstName}`;
  }
})*/

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    //delete passwordHash so its not revealed
    delete returnedObject.passwordHash
  },
})

module.exports = mongoose.model('User', userSchema)
