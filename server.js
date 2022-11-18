require("dotenv").config();
const express = require("express");
const cors = require("cors");
const contactRouter = require("./routes/contactRoutes");

//express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/contacts", contactRouter);

app.listen(process.env.PORT || 4000, () => {
  console.log(`running on port ${process.env.PORT}`);
});
