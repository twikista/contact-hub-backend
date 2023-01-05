const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
  publicId: String,
  url: String,
});

const contactInfoSchema = mongoose.Schema({
  phone: {
    type: [Number],
    required: true,
  },
  email: {
    type: [String],
    required: false,
  },
  city: String,
});

const contactSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },

  contactInfo: contactInfoSchema,

  image: {
    type: imageSchema,
  },
  tag: {
    type: [String],
    required: false,
  },
});

module.exports = mongoose.model("Contact", contactSchema);
