const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const Contact = require("../models/contactModel");
const User = require("../models/contactModel");

//get all contacts
const getContacts = asyncHandler(async (req, res) => {
  try {
    const contacts = await Contact.find({ user_id: req.user._id });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(400);
    throw new Error("request failed");
  }
});

//get single contact by its id
const getContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  //check if id is valid mongoose id type
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error("contact not found");
    // return res.status(404).json({ error: "contact not found" });
  }

  const contact = await Contact.findById(id);

  if (!contact) {
    res.status(404);
    throw new Error("contact not found");
    // return res.status(404).json({ error: "contact not found" });
  }

  if (!req.user) {
    res.status(401);
    throw new Error("user not found");
    // return res.status(401).json({ error: "user not found" });
  }

  if (contact.user_id !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
    // return res.status(401).json({ error: "Not authorized" });
  }
  res.status(200).json(contact);
});

const createNewContact = asyncHandler(async (req, res) => {
  const { firstName, lastName, contactInfo, image, category } = req.body;
  // try {
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
    user_id: req.user._id,
    firstName,
    lastName,
    contactInfo,
    image: img,
    category,
  };
  // console.log(contactData);
  const contact = await Contact.create(contactData);
  if (!contact) {
    res.status(404);
    throw new Error("unable to complete");
  }
  // console.log(imgUploadRes);
  res.status(200).json(contact);
  // } catch (error) {
  //   res.status(404);
  //   throw new Error("failed");
  //   // res.status(404).json({ msg: "failed!" });
  // }
});

const updateContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newContactImage, contact } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error("contact not found");
    // return res.status(404).json({ msg: "contact no found" });
  }

  if (!req.user) {
    res.status(401);
    throw new Error("user not found");
    // return res.status(401).json({ error: "user not found" });
  }

  if (contact.user_id !== req.user.id) {
    res.status(401);
    throw new Error("Not Authorized");
    // return res.status(401).json({ error: "Not authorized" });
  }

  if (newContactImage) {
    const destroyImageResponse = await cloudinary.uploader.destroy(
      contact.image.publicId
    );

    if (destroyImageResponse) {
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

        const updatedContact = await Contact.findByIdUpdate(
          id,
          updatedContactData,
          { new: true }
        );

        if (!updatedContact) {
          res.status(404);
          throw new Error("contact not found");
          // return res.satus(404).json({ msg: "contact not found" });
        }
        res.status(200).json(updatedContact);
      }
    }
  } else {
    // try {
    const updatedContact = await Contact.findByIdAndUpdate(id, contact, {
      new: true,
    });
    if (!updatedContact) {
      res.status(404);
      throw new Error("contact not found");
      // return res.satus(404).json({ msg: "contact not found" });
    }
    res.status(200).json(updatedContact);
    // } catch (error) {
    //   res.status(404);
    //   throw new Error("failed");
    //   // res.status(404).json({ msg: error });
    // }
  }
});

const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //check if id is valid mongoose id type
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error("contact not found");
    // return res.status(404).json({ msg: "contact no found" });
  }

  const contact = await Contact.findById(id);

  if (!contact) {
    res.status(404);
    throw new Error("contact not found");
    // return res.status(404).json({ msg: "contact no found" });
  }

  if (!req.user) {
    res.status(401);
    throw new Error("user not found");
    // return res.status(401).json({ error: "user not found" });
  }

  if (contact.user_id !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");

    // return res.status(401).json({ error: "Not authorized" });
  }

  await Contact.findOneAndDelete({ _id: id });

  //remove deleted contact image from cloudinary
  if (contact.image.publicId) {
    await cloudinary.uploader.destroy(contact.image.publicId);
  }

  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  getContact,
  createNewContact,
  updateContact,
  deleteContact,
};
