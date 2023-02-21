const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const cloudinary = require("../config/cloudinary");
//npm install -g npm@9.4.0

// @desc    Register new user
// @route   POST /users/signup
// @access  Public

const userSignup = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, avatar } = req.body;
  let userAvatar = { publicId: "", url: "" };
  // try {
  //check if all required form fields are completed
  if (!firstName || !email || !password) {
    res.status(400);
    throw new Error("Please, complete all required fields");
    // .json({ msg: "Please, complete all required fields" });

    // throw Error("Please, complete all required fields");
  }

  //check if email is valid
  if (!validator.isEmail(email)) {
    res.status(400);
    // .json({ msg: "Please, enter valid email" });
    throw new Error("Please, enter valid email");
  }

  //check if password is strong enough
  if (!validator.isStrongPassword(password)) {
    res.status(400);
    // .json({ msg: "password not strong enough" });
    throw new Error("password not strong enough");
  }

  //check if user already exist
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    // .json({ msg: "email already in use" });
    throw new Error("email already in use");
  }

  //check if user uploaded avatar and save to Cloudinary
  if (avatar) {
    const avatarUploadResponse = await cloudinary.uploader.upload(avatar, {
      upload_preset: "pally-users",
    });

    //check if avatar upload is successful and save public_id and url to variable
    if (avatarUploadResponse) {
      userAvatar = {
        publicId: avatarUploadResponse.public_id,
        url: avatarUploadResponse.url,
      };
    }
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create new user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    avatar: userAvatar,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.fullName,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("invalid user data");
  }
  // } catch (error) {
  //   res.status(400);
  //   throw new Error("process failed");
  //   // res.status(400).json({ error: "process failed " });
  // }
});

// @desc    Login user
// @route   POST /users/login
// @access  Public

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // try {
  //check if email and password field are completed
  if (!email || !password) {
    res.status(400);
    throw new Error("complete all fields");
  }
  //check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ msg: "incorrect email" });
    throw new Error("incorrect email");
  }
  //check if password is correct
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(400).json({ msg: "incorrect password" });
    throw new Error("incorrect password");
  }

  res.status(201).json({
    _id: user._id,
    name: user.fullName,
    email: user.email,
    token: generateToken(user._id),
  });
  // } catch (error) {
  //   console.log(error);
  // }
});

function generateToken(_id) {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

module.exports = { userSignup, userLogin };
