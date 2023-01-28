require("dotenv").config();
const conntectDb = require("./config/connectDb");
const express = require("express");
const cors = require("cors");
const contactRouter = require("./routes/contactRoutes");
const userRouter = require("./routes/userRoutes");

conntectDb();
//express app
const app = express();

app.use(express.json({ limit: "10mb", extended: true }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);
app.use(cors());

app.use("/api/contacts", contactRouter);
// app.use("/users", userRouter);

app.listen(process.env.PORT || 4000, () => {
  console.log(`running on port ${process.env.PORT}`);
});
