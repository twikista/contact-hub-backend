const express = require("express");

const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/profile", userProfile);

module.exports = router;
