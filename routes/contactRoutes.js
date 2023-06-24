const express = require('express')
const {
  getContacts,
  getContact,
  createNewContact,
  updateContact,
  deleteContact,
} = require('../controller/contactControllers')
const protectRoutes = require('../middleware/protectRoutes')

const router = express.Router()

// router.use(protectRoutes);

router.get('/', getContacts)

router.get('/:id', protectRoutes, getContact)

router.post('/', protectRoutes, createNewContact)

router.put('/:id', protectRoutes, updateContact)

router.delete('/:id', protectRoutes, deleteContact)

module.exports = router
