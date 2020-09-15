const env = process.env.NODE_ENV // 环境参数

let MYSQL_CONF

if (env === 'dev') {
  MYSQL_CONF = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'admin_design'
  }
}

module.exports = {
  MYSQL_CONF
}
