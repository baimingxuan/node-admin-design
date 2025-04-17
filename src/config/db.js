import { Sequelize } from 'sequelize'
import config from './index.js'

const { database, username, password, host, port } = config.database

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: 'mysql',
  timezone: '+08:00',
  define: {
    timestamps: false, // 添加时间戳字段
    paranoid: true, // 软删除
    underscored: true // 下划线字段（snake_case）
  },
  logging: log => {
    console.log(log)
  }
})

export default sequelize
