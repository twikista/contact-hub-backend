const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const cloudinary = require('../config/cloudinary')

const getUsers = async (req, res) => {
  const users = await User.find({})
  res.status(200).json(users)
}
// @desc    Register new user
// @route   POST /users/signup
// @access  Public

const userSignup = async (req, res) => {
  const { firstName, lastName, email, password, avatar } = req.body
  let userAvatar = { publicId: '', url: '' }

  //check if user uploaded avatar and save to Cloudinary
  if (avatar) {
    const avatarUploadResponse = await cloudinary.uploader.upload(avatar, {
      upload_preset: 'pally-users',
    })

    //check if avatar upload is successful and save public_id and url to variable
    if (avatarUploadResponse) {
      userAvatar = {
        publicId: avatarUploadResponse.public_id,
        url: avatarUploadResponse.url,
      }
    } else {
      return res
        .status(500)
        .json({ error: 'Something went wrong. Please try again' })
    }
  }

  //Hash password
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  //create new user
  const user = new User({
    firstName,
    lastName,
    email,
    passwordHash,
    avatar: userAvatar,
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
}

// @desc    Login user
// @route   POST /users/login
// @access  Public

const userLogin = async (req, res) => {
  const { email, password } = req.body
  console.log(email, password)

  if (!email || !password) {
    return res.status(400).json({ error: 'complete all fields' })
  }
  //check if user exists
  const user = await User.findOne({ email })

  const passwordMatch = await bcrypt.compare(password, user.passwordHash)
  if (!(user && passwordMatch)) {
    return res.status(400).json({ msg: 'incorrect email or password' })
  }

  const token = generateToken(user._id)

  res.status(201).json({
    id: user._id,
    name: user.fullName,
    email: user.email,
    token,
  })
}

function generateToken(_id) {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

module.exports = { userSignup, userLogin, getUsers }
