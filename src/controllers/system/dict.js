import { Op } from 'sequelize'
import db from '../../models/index.js'

const { Dict, DictDetail } = db

// 获取字典列表
export const list = async ctx => {
  const { page = 1, size = 10, name } = ctx.query

  // 构建查询条件
  const where = {}
  if (name) {
    where.name = {
      [Op.like]: `%${name}%`
    }
  }

  // 查询字典列表
  const { count, rows } = await Dict.findAndCountAll({
    where,
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

// 获取字典详情
export const detail = async ctx => {
  const { id } = ctx.params

  const dict = await Dict.findByPk(id)

  if (!dict) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '字典不存在'
    }
    return
  }

  ctx.body = {
    code: 200,
    data: dict
  }
}

// 创建字典
export const create = async ctx => {
  const dictData = ctx.request.body

  // 检查字典名是否已存在
  const existDict = await Dict.findOne({
    where: { name: dictData.name }
  })

  if (existDict) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '字典名已存在'
    }
    return
  }

  // 创建字典
  const dict = await Dict.create({
    ...dictData,
    create_by: ctx.state.user.username
  })

  ctx.status = 201
  ctx.body = {
    code: 201,
    message: '创建成功',
    data: dict
  }
}

// 更新字典
export const update = async ctx => {
  const { id } = ctx.params
  const dictData = ctx.request.body

  // 查询字典
  const dict = await Dict.findByPk(id)

  if (!dict) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '字典不存在'
    }
    return
  }

  // 检查字典名是否已存在
  if (dictData.name !== dict.name) {
    const existDict = await Dict.findOne({
      where: {
        name: dictData.name,
        dict_id: {
          [Op.ne]: id
        }
      }
    })

    if (existDict) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '字典名已存在'
      }
      return
    }
  }

  // 更新字典信息
  await dict.update({
    ...dictData,
    update_by: ctx.state.user.username
  })

  ctx.body = {
    code: 200,
    message: '更新成功'
  }
}

// 删除字典
export const remove = async ctx => {
  const { id } = ctx.params

  // 查询字典
  const dict = await Dict.findByPk(id)

  if (!dict) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '字典不存在'
    }
    return
  }

  // 检查是否有字典详情关联此字典
  const detailCount = await DictDetail.count({
    where: { dict_id: id }
  })

  if (detailCount > 0) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '字典下存在字典详情，无法删除'
    }
    return
  }

  // 删除字典
  await dict.destroy()

  ctx.body = {
    code: 200,
    message: '删除成功'
  }
}

// 获取所有字典
export const all = async ctx => {
  const dicts = await Dict.findAll()

  ctx.body = {
    code: 200,
    data: dicts
  }
}
