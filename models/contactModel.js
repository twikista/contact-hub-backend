const mongoose = require("mongoose");

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
        type: [Number],
        required: true,
      },
      email: {
        type: [String],
        required: false,
      },
      city: {
        type: [String],
        required: false,
      },
    },

    image: {
      publicId: String,
      url: String,
    },
    tag: {
      type: [String],
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
