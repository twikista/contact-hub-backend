const express = require('express')
const {
  userSignup,
  userLogin,
  getUsers,
} = require('../controller/userController')

const router = express.Router()
router.get('/', getUsers)
router.post('/signup', userSignup)
router.post('/login', userLogin)

module.exports = router
