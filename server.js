const app = require('./app')

app.listen(process.env.PORT, () => {
  console.log(`running on port ${process.env.PORT}`)
})
