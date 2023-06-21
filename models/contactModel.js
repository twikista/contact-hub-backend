const mongoose = require('mongoose')

const contactSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: false,
    },

    contactInfo: {
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
    },

    image: {
      publicId: String,
      url: String,
    },
    category: {
      type: String,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
)

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Contact', contactSchema)
