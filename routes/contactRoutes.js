const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "GET all contacts" });
});

router.get("/:id", (req, res) => {
  res.json({ message: "GET single contact" });
});

router.post("/", (req, res) => {
  res.json({ message: "ADD a new contact" });
});

router.put("/:id", (req, res) => {
  res.json({ message: "UPDATE a contact" });
});

router.delete("/:id", (req, res) => {
  res.json({ message: "DELETE a contact" });
});

module.exports = router;
