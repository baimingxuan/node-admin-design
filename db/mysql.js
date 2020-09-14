const mysql = require('mysql')
const { MYSQL_CONF } = require('../config/db')

function sqlCon() {
  return mysql.createConnection(MYSQL_CONF)
}

function querySql(sql) {
  const con = sqlCon().connect()
  return new Promise((resolve, reject) => {
    try {
      con.query(sql, (err, results) => {
        if (err) {
          console.log('查询失败，原因：' + JSON.stringify(err))
          reject(err)
        } else {
          console.log('查询成功，' + JSON.stringify(results))
        }
      })
    } catch (e) {
      reject(e)
    } finally {
      con.end()
    }
  })
}

function queryUser(sql) {
  return new Promise((resolve, reject) => {
    querySql(sql).then(results => {
      if (results && results.length > 0) {
        resolve(results[0])
      } else {
        resolve(null)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

module.exports = {
  querySql,
  queryUser
}


