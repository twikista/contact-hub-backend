const mongoose = require("mongoose");
const { url } = require("../config/cloudinary");
const cloudinary = require("../config/cloudinary");
const Contact = require("../models/contactModel");

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
    return res.status(404).json({ error: "contact not found" });
  }
  const contact = await Contact.findById(id);
  if (!contact) {
    return res.status(404).json({ error: "contact not found" });
  }
  res.status(200).json(contact);
};

const createNewContact = async (req, res) => {
  const { firstName, lastName, contactInfo, image, tag } = req.body;
  try {
    let img = { publicId: "", url: "" };
    if (image) {
      const imageUploadResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "pally-contacts",
      });

      if (imageUploadResponse) {
        img = {
          publicId: imageUploadResponse.public_id,
          url: imageUploadResponse.url,
        };
      }
    }
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
  } catch (error) {
    res.status(404).json({ msg: "failed!" });
  }
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { newContactImage, contact } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ msg: "contact no found" });
  }
  if (newContactImage) {
    const destroyImageRespnse = await cloudinary.uploader.destroy(
      contact.image.publicId
    );

    if (destroyImageRespnse) {
      const imageUploadResponse = await cloudinary.uploader.upload(
        newContactImage,
        { upload_preset: "pally-contacts" }
      );

      if (imageUploadResponse) {
        const img = {
          publicId: imageUploadResponse.public_id,
          url: imageUploadResponse.url,
        };
        const updatedContactData = {
          ...contact,
          image: img,
        };

        const updatedContact = await Contact.findOneAndUpdate(
          { _id: id },
          updatedContactData
        );

        if (!updatedContact) {
          return res.satus(404).json({ msg: "contact not found" });
        }
        res.status(200).json(updatedContact);
      }
    }
  } else {
    try {
      const updatedContact = await Contact.findOneAndUpdate(
        { _id: id },
        contact
      );
      if (!updatedContact) {
        return res.satus(404).json({ msg: "contact not found" });
      }
      res.status(200).json(updatedContact);
    } catch (error) {
      res.status(404).json({ msg: error });
    }
  }
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  //check if id is valid mongoose id type
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ msg: "contact no found" });
  }
  const contact = await Contact.findOneAndDelete({ _id: id });
  if (!contact) {
    return res.status(404).json({ msg: "contact no found" });
  }
  //remove deleted contact image from cloudinary
  if (contact.image.publicId) {
    await cloudinary.uploader.destroy(contact.image.publicId);
  }

  res.status(200).json(contact);
};

module.exports = {
  getContacts,
  getContact,
  createNewContact,
  updateContact,
  deleteContact,
};
