const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/userModel");
const cloudinary = require("../config/cloudinary");
//npm install -g npm@9.4.0

// @desc    Register new user
// @route   POST /users/signup
// @access  Public

const userSignup = async (req, res) => {
  const { firstName, lastName, email, password, avatar } = req.body;
  let userAvatar = { publicId: "", url: "" };
  try {
    //check if all required form fields are completed
    if (!firstName || !email || !password) {
      res.status(400);
      throw new Error("Please, complete all required fields");
    }

    //check if email is valid
    if (!validator.isEmail(email)) {
      res.status(400);
      throw new Error("Please, enter valid email");
    }

    //check if password is strong enough
    if (!validator.isStrongPassword(password)) {
      res.status(400);
      throw new Error("password not strong enough");
    }

    //check if user already exist
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
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
  } catch (error) {
    res.status(400).json({ error: "process failed " });
  }
};

module.exports = { userSignup };
