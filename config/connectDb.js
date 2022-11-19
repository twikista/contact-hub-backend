const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const outcome = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`conntected to: ${outcome.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
