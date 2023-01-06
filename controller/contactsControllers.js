const mongoose = require("mongoose");
const { url } = require("../config/cloudinary");
const cloudinary = require("../config/cloudinary");
const Contact = require("../models/contacts");

//get all contacts
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({});
    res.status(200).json(contacts);
  } catch (error) {
    res.status(400).json({ msg: "request failed" });
  }
};

//get single contact by its id
const getContact = async (req, res) => {
  const { id } = req.params;
  //check if id is valid mongoose id type
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ msg: "contact does not exist" });
  }
  const contact = await Contact.findById(id);
  if (!contact) {
    return res.status(404).json({ msg: "contact does not exist" });
  }
  res.status(200).json(contact);
};

const createNewContact = async (req, res) => {
  const { firstName, lastName, contactInfo, image, tag } = req.body;
  try {
    if (image) {
      const imgUploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "pally-contacts",
      });

      if (imgUploadRes) {
        const img = {
          publicId: imgUploadRes.public_id,
          url: imgUploadRes.url,
        };
        const contactData = {
          firstName,
          lastName,
          contactInfo,
          image: img,
          tag,
        };
        const contact = await Contact.create(contactData);
        // console.log(imgUploadRes);
        res.status(200).json(contact);
      }
    }
  } catch (error) {
    res.status(400).json({ msg: "failed!" });
  }
};

const updateContact = (req, res) => {
  res.status(200).json({ message: `UPDATE contact ${req.params.id}` });
};

const deleteContact = (req, res) => {
  res.status(200).json({ message: `DELETE contact ${req.params.id}` });
};

module.exports = {
  getContacts,
  getContact,
  createNewContact,
  updateContact,
  deleteContact,
};
