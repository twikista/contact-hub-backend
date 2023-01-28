const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protectRoutes = async (req, res, next) => {
  const { authorization } = req.header;
  if (!authorization) {
    res.status(401).json({ error: "authorization token required" });
  }
  //get token from header
  const token = authorization.split(" ")[1];
  try {
    //get id from decoded jwt token
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    //get user from db with user id
    const user = await User.findById({ _id }).select("-password");
    //add user details to the req object
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("Request is not authorized");
  }
};

module.exports = protectRoutes;
