import bcrypt from 'bcryptjs'
import sequelize from '../src/config/db.js'
import User from '../src/models/user.js'

// 初始化数据库
async function initDatabase() {
  try {
    await User.sync({ force: true })
    console.log('数据库初始化成功')

    // 创建用户
    await User.create({
      username: 'admin',
      nick_name: '管理员',
      gender: '男',
      phone: '13800138000',
      email: 'admin@example.com',
      avatar_path: 'avatar.jpg',
      password: bcrypt.hashSync('123456', 10),
      is_admin: true,
      enabled: true,
      dept_id: 2,
      create_time: new Date(),
      create_by: 'admin'
    })
  } catch (error) {
    console.log('数据库初始化失败', error)
  } finally {
    // 关闭数据库连接
    await sequelize.close()
  }
}

// 执行初始化
initDatabase()
