const express = require('express')
const app = express()
const conntectDb = require('./config/connectDb')
const cors = require('cors')
const contactRouter = require('./routes/contactRoutes')
const userRouter = require('./routes/userRoutes')
const { errorHandler } = require('./middleware/errorMiddleWare')

conntectDb()

app.use(express.json({ limit: '10mb', extended: true }))
app.use(
  express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 })
)
app.use(cors())

app.use('/api/contacts', contactRouter)
app.use('/api/user', userRouter)

app.use(errorHandler)

module.exports = app
