const mysql = require('mysql')
// mysql连接配置
const { MYSQL_CONF } = require('../config/db')
const { debug } = require('../utils/constant')

function sqlCon() {
  return mysql.createConnection(MYSQL_CONF)
}

function querySql(sql) {
  const con = sqlCon().connect()
  debug && console.log(sql)
  return new Promise((resolve, reject) => {
    try {
      con.query(sql, (err, results) => {
        if (err) {
          debug && console.log('查询失败，原因：' + JSON.stringify(err))
          reject(err)
        } else {
          debug && console.log('查询成功，' + JSON.stringify(results))
          resolve(results)
        }
      })
    } catch (e) {
      reject(e)
    } finally {
      con.end()
    }
  })
}

module.exports = {
  querySql
}


