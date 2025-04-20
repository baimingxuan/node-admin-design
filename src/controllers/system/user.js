import { Op } from 'sequelize'
import db from '../../models/index.js'

const { User, Role, Dept, Job } = db

// 获取用户列表
export const list = async ctx => {
  const { page = 1, size = 10, username, deptId, enabled } = ctx.query

  // 构建查询条件
  const where = {}
  if (username) {
    where.username = {
      [Op.like]: `%${username}%`
    }
  }
  if (deptId) {
    where.dept_id = deptId
  }
  if (enabled !== undefined) {
    where.enabled = enabled === 'true'
  }

  // 查询用户列表
  const { count, rows } = await User.findAndCountAll({
    where,
    include: [
      {
        model: Dept,
        attributes: ['dept_id', 'name']
      },
      {
        model: Role,
        through: { attributes: [] },
        attributes: ['role_id', 'name']
      },
      {
        model: Job,
        through: { attributes: [] },
        attributes: ['job_id', 'name']
      }
    ],
    attributes: { exclude: ['password'] },
    offset: (page - 1) * size,
    limit: parseInt(size),
    order: [['create_time', 'DESC']]
  })

  ctx.body = {
    code: 200,
    data: {
      content: rows,
      totalElements: count
    }
  }
}

// 获取用户详情
export const detail = async ctx => {
  const { id } = ctx.params

  const user = await User.findByPk(id, {
    include: [
      {
        model: Dept,
        attributes: ['dept_id', 'name']
      },
      {
        model: Role,
        through: { attributes: [] },
        attributes: ['role_id', 'name']
      },
      {
        model: Job,
        through: { attributes: [] },
        attributes: ['job_id', 'name']
      }
    ],
    attributes: { exclude: ['password'] }
  })

  if (!user) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '用户不存在'
    }
    return
  }

  ctx.body = {
    code: 200,
    data: user
  }
}

// 创建用户
export const create = async ctx => {
  const userData = ctx.request.body
  const { username, email, phone, roleIds, jobIds } = userData

  // 检查用户名是否已存在
  const existUser = await User.findOne({
    where: {
      [Op.or]: [{ username }, { email }, { phone }]
    }
  })

  if (existUser) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '用户名或邮箱或手机号已存在'
    }
    return
  }

  // 创建用户
  const user = await User.create({
    ...userData,
    create_by: ctx.state.user.username
  })

  // 关联角色
  if (roleIds && roleIds.length > 0) {
    await user.setRoles(roleIds)
  }

  // 关联岗位
  if (jobIds && jobIds.length > 0) {
    await user.setJobs(jobIds)
  }

  ctx.status = 201
  ctx.body = {
    code: 201,
    message: '创建成功',
    data: user
  }
}

// 更新用户
export const update = async ctx => {
  const { id } = ctx.params
  const userData = ctx.request.body
  const { username, email, phone, roleIds, jobIds } = userData

  // 查询用户
  const user = await User.findByPk(id)

  if (!user) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '用户不存在'
    }
    return
  }

  // 检查用户名或邮箱或手机号是否已存在
  if (username !== user.username || email !== user.email || phone !== user.phone) {
    const existUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }, { phone }],
        user_id: {
          [Op.ne]: id
        }
      }
    })

    if (existUser) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '用户名或邮箱或手机号已存在'
      }
      return
    }
  }

  // 更新用户信息
  await user.update({
    ...userData,
    update_by: ctx.state.user.username
  })

  // 更新角色关联
  if (roleIds) {
    await user.setRoles(roleIds)
  }

  // 更新岗位关联
  if (jobIds) {
    await user.setJobs(jobIds)
  }

  ctx.body = {
    code: 200,
    message: '更新成功'
  }
}

// 删除用户
export const remove = async ctx => {
  const { id } = ctx.params

  // 查询用户
  const user = await User.findByPk(id)

  if (!user) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '用户不存在'
    }
    return
  }

  // 不能删除超级管理员
  if (user.is_admin) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '不能删除超级管理员'
    }
    return
  }

  // 删除用户
  await user.destroy()

  ctx.body = {
    code: 200,
    message: '删除成功'
  }
}
