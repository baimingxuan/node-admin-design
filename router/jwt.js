const jwt = require('express-jwt')
const { SECRET_KEY } = require('../utils/constant')

module.exports = jwt({
  secret: SECRET_KEY,
  algorithms: ['HS256'],
  credentialsRequired: true
}).unless({
  path: ['/user/login']
})
