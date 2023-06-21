const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const cloudinary = require('../config/cloudinary')
const Contact = require('../models/contactModel')
const User = require('../models/contactModel')

//get all contacts
const getContacts = async (req, res) => {
  const user = req.user

  const contacts = await Contact.find({ user: user.id })
  res.status(200).json(contacts)
}

//get single contact by its id
const getContact = async (req, res) => {
  const { id } = req.params

  const contact = await Contact.findById(id)

  if (!contact) {
    return res.status(404).json({ error: 'contact not found' })
  }

  if (contact.user !== req.user._id) {
    return res.status(401).json({ error: 'Not authorized' })
  }
  res.status(200).json(contact)
}

const createNewContact = async (req, res) => {
  const { firstName, lastName, contactInfo, image, category } = req.body

  let img = { publicId: '', url: '' }

  const imageUploadResponse = image
    ? await cloudinary.uploader.upload(image, {
        upload_preset: 'pally-contacts',
      })
    : null

  if (imageUploadResponse) {
    img.publicId = imageUploadResponse.public_id
    img.url = imageUploadResponse.url
  } else {
    return res.status(500).json({ error: 'server error. please try gain' })
  }

  const contact = new Contact({
    firstName,
    lastName,
    contactInfo,
    image: img,
    category,
    user: req.user._id,
  })

  const savedContact = await Contact.save(contact)
  res.status(200).json(savedContact)
}

const updateContact = async (req, res) => {
  const { id } = req.params
  const { newContactImage, contact } = req.body

  if (contact.user !== req.user._id) {
    return res.status(401).json({ error: 'Not authorized' })
  }

  if (newContactImage) {
    const destroyImageResponse = await cloudinary.uploader.destroy(
      contact.image.publicId
    )

    if (!destroyImageResponse) {
      return res
        .status(500)
        .json({ error: 'something went wron. please try again' })
    }

    const imageUploadResponse = await cloudinary.uploader.upload(
      newContactImage,
      { upload_preset: 'pally-contacts' }
    )

    if (imageUploadResponse) {
      const img = {
        publicId: imageUploadResponse.public_id,
        url: imageUploadResponse.url,
      }
      const updatedContactData = {
        ...contact,
        image: img,
      }

      const updatedContact = await Contact.findByIdAndUpdate(
        id,
        updatedContactData,
        { new: true, runValidators: true, context: 'query' }
      )

      res.status(200).json(updatedContact)
    } else {
      return res.status(500).json({ error: 'server error. please try again' })
    }
  }

  const updatedContact = await Contact.findByIdAndUpdate(id, contact, {
    new: true,
    runValidators: true,
    context: 'query',
  })

  res.status(200).json(updatedContact)
}

//Delete
const deleteContact = async (req, res) => {
  const { id } = req.params

  const contact = await Contact.findById(id)

  if (contact.user_id !== req.user.id) {
    return res.status(401).json({ error: 'Not authorized' })
  }

  await Contact.findOneAndDelete({ _id: id })

  //remove deleted contact image from cloudinary
  if (contact.image.publicId) {
    await cloudinary.uploader.destroy(contact.image.publicId)
  }

  res.status(200).json(contact)
}

module.exports = {
  getContacts,
  getContact,
  createNewContact,
  updateContact,
  deleteContact,
}
