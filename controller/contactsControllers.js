const { url } = require("../config/cloudinary");
const cloudinary = require("../config/cloudinary");
const Contact = require("../models/contacts");

const getContacts = (req, res) => {
  res.status(200).json({ message: "GET all contacts" });
};

const getContact = (req, res) => {
  res.status(200).json({ message: `GET contact ${req.params.id}` });
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
