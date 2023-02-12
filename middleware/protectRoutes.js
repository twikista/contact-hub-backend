const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protectRoutes = async (req, res, next) => {
  let token;
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      //get token from header
      token = authorization.split(" ")[1];
      //get id from decoded jwt token
      const { _id } = jwt.verify(token, process.env.JWT_SECRET);
      //get user from db with user id and add user details to the req object
      req.user = await User.findById(_id).select("-password");

      console.log(req.user);
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: "Request is not authorized" });
      // throw new Error("Request is not authorized");
    }
    // res.status(401).json({ error: "authorization token required" });
    // throw new Error("authorization token required");
  }
  if (!token) {
    return res.status(401).json({ error: "authorization token required" });
    // throw Error("authorization token required");
  }
};

module.exports = protectRoutes;
