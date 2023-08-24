const mongoose = require('mongoose')
require('dotenv').config()

const MONGO_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGO_URI
    : process.env.MONGO_URI

const connectDb = async () => {
  mongoose.set('strictQuery', false)
  try {
    console.log(`connecting... to MongoDB`)
    const outcome = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`conntected to: ${outcome.connection.host}`)
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectDb
