import { Sequelize } from 'sequelize'
import config from './index.js'

const { database, username, password, host, port } = config.database

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: 'mysql',
  timezone: '+08:00',
  define: {
    timestamps: true, // 添加时间戳字段
    paranoid: true, // 软删除
    createdAt: 'create_time',
    updatedAt: 'update_time',
    deletedAt: 'delete_time',
    underscored: true, // 下划线字段（snake_case）
    freezeTableName: true, // 表名与模型名相同
    scopes: {
      bh: {
        attributes: {
          exclude: ['create_time', 'update_time', 'delete_time']
        }
      }
    }
  },
  logging: log => {
    console.log(log)
  }
})

export default sequelize
