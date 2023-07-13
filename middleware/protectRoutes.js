const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protectRoutes = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer')) {
    //get token from header
    token = authorization.replace('Bearer ', '')
    console.log(token)

    //extract id from token
    const { _id } = jwt.verify(token, process.env.JWT_SECRET)
    if (!_id) {
      return res.status(401).json({ error: 'invalid token' })
    }

    const user = await User.findById(_id).select('-password')
    req.user = user
    console.log(user)
    next()
  } else {
    res.status(401).json({ error: 'unauthorized request' })
    next()
  }
}

module.exports = protectRoutes
