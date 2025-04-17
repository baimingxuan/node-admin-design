import bcrypt from 'bcryptjs'
import db from '../src/models/index.js'

const { sequelize, User, Role, Dept, Job, Menu, Dict, DictDetail } = db

// 初始化数据库
async function initDatabase() {
  try {
    await User.sync({ force: true })
    console.log('数据库初始化成功')

    // 创建部门
    const dept = await Dept.create({
      name: '公司总部',
      dept_sort: 0,
      enabled: true,
      create_time: new Date()
    })

    // 创建岗位
    const job = await Job.create({
      name: '全栈开发',
      enabled: true,
      job_sort: 1,
      create_time: new Date()
    })

    // 创建角色
    const role = await Role.create({
      name: '超级管理员',
      level: 1,
      description: '系统所有权限',
      data_scope: '全部',
      create_time: new Date()
    })

    // 创建用户
    const admin = await User.create({
      dept_id: dept.dept_id,
      username: 'admin',
      nick_name: '管理员',
      gender: '男',
      phone: '13800138000',
      email: 'admin@example.com',
      avatar_name: 'avatar.jpg',
      avatar_path: 'avatar.jpg',
      password: bcrypt.hashSync('123456', 10),
      is_admin: true,
      enabled: true,
      create_time: new Date()
    })

    // 创建菜单
    const systemMenu = await Menu.create({
      type: 0,
      title: '系统管理',
      menu_sort: 1,
      icon: 'system',
      path: '/system',
      i_frame: false,
      cache: false,
      hidden: false,
      create_time: new Date()
    })

    // 关联用户和角色
    await admin.addRole(role)

    // 关联用户和岗位
    await admin.addJob(job)

    // 关联角色和菜单
    await role.addMenus([systemMenu])

    // 创建字典
    const dict = await Dict.create({
      name: 'user_status',
      description: '用户状态',
      create_time: new Date()
    })

    // 创建字典详情
    await DictDetail.create({
      dict_id: dict.dict_id,
      label: '激活',
      value: 'true',
      dict_sort: 1,
      create_time: new Date()
    })

    await DictDetail.create({
      dict_id: dict.dict_id,
      label: '禁用',
      value: 'false',
      dict_sort: 2,
      create_time: new Date()
    })

    console.log('数据库初始化完成')
  } catch (error) {
    console.log('数据库初始化失败', error)
  } finally {
    // 关闭数据库连接
    await sequelize.close()
  }
}

// 执行初始化
initDatabase()
