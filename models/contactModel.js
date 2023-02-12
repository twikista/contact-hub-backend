const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
