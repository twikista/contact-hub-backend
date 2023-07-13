const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const cloudinary = require('../config/cloudinary')
const Contact = require('../models/contactModel')
const User = require('../models/contactModel')

//get all contacts
const getContacts = async (req, res) => {
  const user = req.user

  const contacts = await Contact.find({ user: user._id })
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

//add new contact
const createNewContact = async (req, res) => {
  // console.log(req.user)
  const { firstName, lastName, contactInfo, image, category } = req.body

  let img = { publicId: '', url: '' }

  if (image) {
    const imageUploadResponse = await cloudinary.uploader.upload(image, {
      upload_preset: 'pally-contacts',
    })

    if (imageUploadResponse) {
      img.publicId = imageUploadResponse.public_id
      img.url = imageUploadResponse.url

      const contact = new Contact({
        firstName,
        lastName,
        contactInfo,
        image: img,
        category,
        user: req.user._id,
      })

      const savedContact = await Contact.save(contact)
      res.status(201).json(savedContact)
    } else {
      return res.status(500).json({ error: 'server error. please try again' })
    }
  }

  const contact = new Contact({
    firstName,
    lastName,
    contactInfo,
    image: img,
    category,
    user: req.user._id,
  })

  const savedContact = await contact.save(contact)
  res.status(201).json(savedContact)
}

//update contact
const updateContact = async (req, res) => {
  const { id } = req.params
  const { newContactImage, contact } = req.body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'invalid id' })
  }

  if (contact.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Not authorized' })
  }

  if (newContactImage) {
    const destroyImageResponse = await cloudinary.uploader.destroy(
      contact.image.publicId
    )

    if (!destroyImageResponse) {
      return res
        .status(500)
        .json({ error: 'something went wrong. please try again' })
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

  if (!contact) {
    return res.status(400).json({ error: 'invalid contact' })
  }

  if (contact.user.toString() !== req.user.id.toString()) {
    return res.status(403).json({ error: 'Not authorized' })
  }

  await Contact.findOneAndDelete({ _id: id })

  //remove deleted contact image from cloudinary
  if (contact.image.publicId) {
    console.log('got trigered')
    await cloudinary.uploader.destroy(contact.image.publicId)
  }

  res.status(204).end()
}

module.exports = {
  getContacts,
  getContact,
  createNewContact,
  updateContact,
  deleteContact,
}
