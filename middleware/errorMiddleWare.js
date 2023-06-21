const logger = require('./logger')

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'invalid id type' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'missing or invalid token' })
  }

  next(error)
}

module.exports = { errorHandler }
