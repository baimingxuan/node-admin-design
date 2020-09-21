const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('./constant')

function decoded(req) {
  let token = req.get('Authorization')
  if (token.indexOf('Bearer ') === 0) {
    token = token.replace('Bearer ', '')
  }
  return jwt.verify(token, SECRET_KEY)
}

module.exports = {
  decoded
}
