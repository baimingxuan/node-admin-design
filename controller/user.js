const { querySql, queryUser } = require('../db/mysql')

function login(username, password) {
  return querySql(`select * from user where username='${username}' and password='${password}';`)
}

function findUser(username) {
  return queryUser(`select * from user where username='${username}';`)
}

module.exports = {
  login,
  findUser
}
