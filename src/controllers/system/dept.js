import { Op } from 'sequelize'
import db from '../../models/index.js'

const { Dept, User } = db

// 获取部门树
export const tree = async ctx => {
  const { name } = ctx.query

  // 构建查询条件
  const where = {}
  if (name) {
    where.name = {
      [Op.like]: `%${name}%`
    }
  }

  const depts = await Dept.findAll({
    where,
    order: [['dept_sort', 'ASC']]
  })

  // 构建部门树
  const buildTree = (items, parentId = null) => {
    const result = []

    for (const item of items) {
      if ((parentId === null && item.pid === null) || item.pid === parentId) {
        const children = buildTree(items, item.dept_id)

        const node = {
          id: item.dept_id,
          label: item.name,
          sort: item.dept_sort,
          enabled: item.enabled,
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

  const tree = buildTree(depts)

  ctx.body = {
    code: 200,
    data: tree
  }
}

// 获取部门列表
export const list = async ctx => {
  const { name, enabled } = ctx.query

  // 构建查询条件
  const where = {}
  if (name) {
    where.name = {
      [Op.like]: `%${name}%`
    }
  }
  if (enabled !== undefined) {
    where.enabled = enabled === 'true'
  }

  const depts = await Dept.findAll({
    where,
    order: [['dept_sort', 'ASC']]
  })

  ctx.body = {
    code: 200,
    data: depts
  }
}

// 获取部门详情
export const detail = async ctx => {
  const { id } = ctx.params

  const dept = await Dept.findByPk(id)

  if (!dept) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '部门不存在'
    }
    return
  }

  ctx.body = {
    code: 200,
    data: dept
  }
}

// 创建部门
export const create = async ctx => {
  const deptData = ctx.request.body

  // 检查部门名是否已存在
  const existDept = await Dept.findOne({
    where: {
      name: deptData.name,
      pid: deptData.pid || null
    }
  })

  if (existDept) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '部门名已存在'
    }
    return
  }

  // 如果是子部门，更新父部门的子部门数量
  if (deptData.pid) {
    const parentDept = await Dept.findByPk(deptData.pid)
    if (parentDept) {
      await parentDept.update({
        sub_count: parentDept.sub_count + 1
      })
    }
  }

  // 创建部门
  const dept = await Dept.create({
    ...deptData,
    create_by: ctx.state.user.username
  })

  ctx.status = 201
  ctx.body = {
    code: 201,
    message: '创建成功',
    data: dept
  }
}

// 更新部门
export const update = async ctx => {
  const { id } = ctx.params
  const deptData = ctx.request.body

  // 查询部门
  const dept = await Dept.findByPk(id)

  if (!dept) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '部门不存在'
    }
    return
  }

  // 检查部门名是否已存在
  if (deptData.name !== dept.name || deptData.pid !== dept.pid) {
    const existDept = await Dept.findOne({
      where: {
        name: deptData.name,
        pid: deptData.pid || null,
        dept_id: {
          [Op.ne]: id
        }
      }
    })

    if (existDept) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '部门名已存在'
      }
      return
    }
  }

  // 如果更改了父部门，需要更新父部门的子部门数量
  if (deptData.pid !== dept.pid) {
    // 减少原父部门的子部门数量
    if (dept.pid) {
      const oldParentDept = await Dept.findByPk(dept.pid)
      if (oldParentDept) {
        await oldParentDept.update({
          sub_count: Math.max(0, oldParentDept.sub_count - 1)
        })
      }
    }

    // 增加新父部门的子部门数量
    if (deptData.pid) {
      const newParentDept = await Dept.findByPk(deptData.pid)
      if (newParentDept) {
        await newParentDept.update({
          sub_count: newParentDept.sub_count + 1
        })
      }
    }
  }

  // 更新部门信息
  await dept.update({
    ...deptData,
    update_by: ctx.state.user.username
  })

  ctx.body = {
    code: 200,
    message: '更新成功'
  }
}

// 删除部门
export const remove = async ctx => {
  const { id } = ctx.params

  // 查询部门
  const dept = await Dept.findByPk(id)

  if (!dept) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '部门不存在'
    }
    return
  }

  // 检查是否有子部门
  if (dept.sub_count > 0) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '存在子部门，无法删除'
    }
    return
  }

  // 检查是否有用户关联此部门
  const userCount = await User.count({
    where: { dept_id: id }
  })

  if (userCount > 0) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '部门下存在用户，无法删除'
    }
    return
  }

  // 如果有父部门，更新父部门的子部门数量
  if (dept.pid) {
    const parentDept = await Dept.findByPk(dept.pid)
    if (parentDept) {
      await parentDept.update({
        sub_count: Math.max(0, parentDept.sub_count - 1)
      })
    }
  }

  // 删除部门
  await dept.destroy()

  ctx.body = {
    code: 200,
    message: '删除成功'
  }
}

// 获取所有部门
export const all = async ctx => {
  const depts = await Dept.findAll({
    where: { enabled: true },
    order: [['dept_sort', 'ASC']]
  })

  ctx.body = {
    code: 200,
    data: depts
  }
}

// 获取上级部门
export const superior = async ctx => {
  const { ids } = ctx.query
  const deptIds = ids.split(',').map(id => parseInt(id))

  // 获取所有部门
  const depts = await Dept.findAll({
    order: [['dept_sort', 'ASC']]
  })

  // 构建部门树
  const buildTree = (items, parentId = null) => {
    const result = []

    for (const item of items) {
      if ((parentId === null && item.pid === null) || item.pid === parentId) {
        const children = buildTree(items, item.dept_id)

        const node = {
          id: item.dept_id,
          label: item.name,
          children: children.length > 0 ? children : undefined
        }

        result.push(node)
      }
    }

    return result
  }

  // 获取指定部门的所有上级部门
  const getSuperior = (depts, id) => {
    const dept = depts.find(d => d.dept_id === id)
    if (!dept || !dept.pid) return []

    const parent = depts.find(d => d.dept_id === dept.pid)
    if (!parent) return []

    return [...getSuperior(depts, parent.dept_id), parent]
  }

  // 获取所有上级部门
  const superiorDepts = []
  for (const id of deptIds) {
    const superior = getSuperior(depts, id)
    superiorDepts.push(...superior)
  }

  // 去重
  const uniqueDepts = [...new Map(superiorDepts.map(item => [item.dept_id, item])).values()]

  // 构建树
  const tree = buildTree(uniqueDepts)

  ctx.body = {
    code: 200,
    data: tree
  }
}
