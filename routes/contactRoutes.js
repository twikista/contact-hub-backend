const express = require("express");
const {
  getContacts,
  getContact,
  createNewContact,
  updateContact,
  deleteContact,
} = require("../controller/contactControllers");

const router = express.Router();

router.get("/", getContacts);

router.get("/:id", getContact);

router.post("/", createNewContact);

router.put("/:id", updateContact);

router.delete("/:id", deleteContact);

module.exports = router;
