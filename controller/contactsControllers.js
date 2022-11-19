const { url } = require("../config/cloudinary");
const cloudinary = require("../config/cloudinary");

const getContacts = (req, res) => {
  res.status(200).json({ message: "GET all contacts" });
};

const getContact = (req, res) => {
  res.status(200).json({ message: `GET contact ${req.params.id}` });
};

const createNewContact = async (req, res) => {
  const { name, image } = req.body;
  try {
    if (image) {
      console.log(name);
      const cloudres = await cloudinary.uploader.upload(image, {
        upload_preset: "pics",
      });

      if (cloudres) {
        const image = { publicId: cloudres.public_id, url: cloudres.url };
        const contact = { name, image };
        console.log(cloudres);
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
