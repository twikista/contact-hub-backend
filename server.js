require("dotenv").config();
const conntectDb = require("./config/connectDb");
const express = require("express");
const cors = require("cors");
const contactRouter = require("./routes/contactRoutes");

conntectDb();
//express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/contacts", contactRouter);

app.listen(process.env.PORT || 4000, () => {
  console.log(`running on port ${process.env.PORT}`);
});
