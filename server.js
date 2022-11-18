require("dotenv").config();
const express = require("express");
const cors = require("cors");

//express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "server is running" });
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`running on port ${process.env.PORT}`);
});
