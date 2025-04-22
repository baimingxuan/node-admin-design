import { Op } from 'sequelize'
import db from '../../models/index.js'

const { Menu } = db

// 获取菜单树
export const tree = async ctx => {
  const menus = await Menu.findAll({
    order: [['menu_sort', 'ASC']]
  })

  // 构建菜单树
  const buildTree = (items, parentId = null) => {
    const result = []

    for (const item of items) {
      if ((parentId === null && item.pid === null) || item.pid === parentId) {
        const children = buildTree(items, item.menu_id)

        const node = {
          id: item.menu_id,
          title: item.title,
          name: item.name,
          component: item.component,
          path: item.path,
          icon: item.icon,
          type: item.type,
          permission: item.permission,
          sort: item.menu_sort,
          hidden: item.hidden,
          cache: item.cache,
          iFrame: item.i_frame,
          createTime: item.create_time
        }

        if (children.length > 0) {
          node.children = children
        }

        result.push(node)
      }
    }

    return result
  }

  const tree = buildTree(menus)

  ctx.body = {
    code: 200,
    data: tree
  }
}

// 获取菜单列表
export const list = async ctx => {
  const { title } = ctx.query

  // 构建查询条件
  const where = {}
  if (title) {
    where.title = {
      [Op.like]: `%${title}%`
    }
  }

  const menus = await Menu.findAll({
    where,
    order: [['menu_sort', 'ASC']]
  })

  ctx.body = {
    code: 200,
    data: menus
  }
}

// 获取菜单详情
export const detail = async ctx => {
  const { id } = ctx.params

  const menu = await Menu.findByPk(id)

  if (!menu) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '菜单不存在'
    }
    return
  }

  ctx.body = {
    code: 200,
    data: menu
  }
}

// 创建菜单
export const create = async ctx => {
  const menuData = ctx.request.body

  // 检查菜单标题是否已存在
  const existMenu = await Menu.findOne({
    where: {
      title: menuData.title
    }
  })

  if (existMenu) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '菜单标题已存在'
    }
    return
  }

  // 如果是子菜单，更新父菜单的子菜单数量
  if (menuData.pid) {
    const parentMenu = await Menu.findByPk(menuData.pid)
    if (parentMenu) {
      await parentMenu.update({
        sub_count: parentMenu.sub_count + 1
      })
    }
  }

  // 创建菜单
  const menu = await Menu.create({
    ...menuData,
    create_by: ctx.state.user.username
  })

  ctx.status = 201
  ctx.body = {
    code: 201,
    message: '创建成功',
    data: menu
  }
}

// 更新菜单
export const update = async ctx => {
  const { id } = ctx.params
  const menuData = ctx.request.body

  // 查询菜单
  const menu = await Menu.findByPk(id)

  if (!menu) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '菜单不存在'
    }
    return
  }

  // 检查菜单标题是否已存在
  if (menuData.title !== menu.title) {
    const existMenu = await Menu.findOne({
      where: {
        title: menuData.title,
        menu_id: {
          [Op.ne]: id
        }
      }
    })

    if (existMenu) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '菜单标题已存在'
      }
      return
    }
  }

  // 如果更改了父菜单，需要更新父菜单的子菜单数量
  if (menuData.pid !== menu.pid) {
    // 减少原父菜单的子菜单数量
    if (menu.pid) {
      const oldParentMenu = await Menu.findByPk(menu.pid)
      if (oldParentMenu) {
        await oldParentMenu.update({
          sub_count: Math.max(0, oldParentMenu.sub_count - 1)
        })
      }
    }

    // 增加新父菜单的子菜单数量
    if (menuData.pid) {
      const newParentMenu = await Menu.findByPk(menuData.pid)
      if (newParentMenu) {
        await newParentMenu.update({
          sub_count: newParentMenu.sub_count + 1
        })
      }
    }
  }

  // 更新菜单信息
  await menu.update({
    ...menuData,
    update_by: ctx.state.user.username
  })

  ctx.body = {
    code: 200,
    message: '更新成功'
  }
}

// 删除菜单
export const remove = async ctx => {
  const { id } = ctx.params

  // 查询菜单
  const menu = await Menu.findByPk(id)

  if (!menu) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '菜单不存在'
    }
    return
  }

  // 检查是否有子菜单
  if (menu.sub_count > 0) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '存在子菜单，无法删除'
    }
    return
  }

  // 如果有父菜单，更新父菜单的子菜单数量
  if (menu.pid) {
    const parentMenu = await Menu.findByPk(menu.pid)
    if (parentMenu) {
      await parentMenu.update({
        sub_count: Math.max(0, parentMenu.sub_count - 1)
      })
    }
  }

  // 删除菜单
  await menu.destroy()

  ctx.body = {
    code: 200,
    message: '删除成功'
  }
}
