const crypto = require('crypto')

function md5(str) {
  return crypto.createHash('md5').update(String(str)).digest('hex')
}

module.exports = {
  md5
}
