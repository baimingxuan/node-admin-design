import { Op } from 'sequelize'
import db from '../../models/index.js'

const { Role, Menu } = db

// 获取角色列表
export const list = async ctx => {
  const { page = 1, size = 10, name } = ctx.query

  // 构建查询条件
  const where = {}
  if (name) {
    where.name = {
      [Op.like]: `%${name}%`
    }
  }

  // 查询角色列表
  const { count, rows } = await Role.findAndCountAll({
    where,
    offset: (page - 1) * size,
    limit: parseInt(size),
    order: [['level', 'ASC']]
  })

  ctx.body = {
    code: 200,
    data: {
      content: rows,
      totalElements: count
    }
  }
}

// 获取角色详情
export const detail = async ctx => {
  const { id } = ctx.params

  const role = await Role.findByPk(id, {
    include: [
      {
        model: Menu,
        through: { attributes: [] }
      }
    ]
  })

  if (!role) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '角色不存在'
    }
    return
  }

  ctx.body = {
    code: 200,
    data: role
  }
}

// 创建角色
export const create = async ctx => {
  const roleData = ctx.request.body
  const { name, menuIds } = roleData

  // 检查角色名是否已存在
  const existRole = await Role.findOne({
    where: { name }
  })

  if (existRole) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '角色名已存在'
    }
    return
  }

  // 创建角色
  const role = await Role.create({
    ...roleData,
    create_by: ctx.state.user.username
  })

  // 关联菜单
  if (menuIds && menuIds.length > 0) {
    await role.setMenus(menuIds)
  }

  ctx.status = 201
  ctx.body = {
    code: 201,
    message: '创建成功',
    data: role
  }
}

// 更新角色
export const update = async ctx => {
  const { id } = ctx.params
  const roleData = ctx.request.body
  const { name, menuIds } = roleData

  // 查询角色
  const role = await Role.findByPk(id)

  if (!role) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '角色不存在'
    }
    return
  }

  // 检查角色名是否已存在
  if (name !== role.name) {
    const existRole = await Role.findOne({
      where: {
        name,
        role_id: {
          [Op.ne]: id
        }
      }
    })

    if (existRole) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '角色名已存在'
      }
      return
    }
  }

  // 更新角色信息
  await role.update({
    ...roleData,
    update_by: ctx.state.user.username
  })

  // 更新菜单关联
  if (menuIds) {
    await role.setMenus(menuIds)
  }

  ctx.body = {
    code: 200,
    message: '更新成功'
  }
}

// 删除角色
export const remove = async ctx => {
  const { id } = ctx.params

  // 查询角色
  const role = await Role.findByPk(id)

  if (!role) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '角色不存在'
    }
    return
  }

  // 检查是否有用户关联此角色
  const userCount = await role.countUsers()

  if (userCount > 0) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '该角色已分配给用户，无法删除'
    }
    return
  }

  // 删除角色
  await role.destroy()

  ctx.body = {
    code: 200,
    message: '删除成功'
  }
}

// 获取角色的菜单
export const menus = async ctx => {
  const { id } = ctx.params

  const role = await Role.findByPk(id, {
    include: [
      {
        model: Menu,
        through: { attributes: [] }
      }
    ]
  })

  if (!role) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '角色不存在'
    }
    return
  }

  ctx.body = {
    code: 200,
    data: role.menus.map(menu => menu.menu_id)
  }
}

// 获取所有角色
export const all = async ctx => {
  const roles = await Role.findAll({
    order: [['level', 'ASC']]
  })

  ctx.body = {
    code: 200,
    data: roles
  }
}
