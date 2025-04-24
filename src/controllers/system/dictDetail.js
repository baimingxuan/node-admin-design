import { Op } from 'sequelize'
import db from '../../models/index.js'

const { Dict, DictDetail } = db

// 获取字典详情列表
export const list = async ctx => {
  const { page = 1, size = 10, dictName } = ctx.query

  // 构建查询条件
  const where = {}
  if (dictName) {
    const dict = await Dict.findOne({
      where: {
        name: dictName
      }
    })

    if (dict) {
      where.dict_id = dict.dict_id
    } else {
      // 如果找不到对应的字典，返回空结果
      ctx.body = {
        code: 200,
        data: {
          content: [],
          totalElements: 0
        }
      }
      return
    }
  }

  // 查询字典详情列表
  const { count, rows } = await DictDetail.findAndCountAll({
    where,
    include: [
      {
        model: Dict,
        attributes: ['name']
      }
    ],
    offset: (page - 1) * size,
    limit: parseInt(size),
    order: [['dict_sort', 'ASC']]
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

  const dictDetail = await DictDetail.findByPk(id, {
    include: [
      {
        model: Dict,
        attributes: ['name']
      }
    ]
  })

  if (!dictDetail) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '字典详情不存在'
    }
    return
  }

  ctx.body = {
    code: 200,
    data: dictDetail
  }
}

// 创建字典详情
export const create = async ctx => {
  const dictDetailData = ctx.request.body

  // 检查字典是否存在
  const dict = await Dict.findByPk(dictDetailData.dict_id)

  if (!dict) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '字典不存在'
    }
    return
  }

  // 检查标签是否已存在
  const existDictDetail = await DictDetail.findOne({
    where: {
      dict_id: dictDetailData.dict_id,
      label: dictDetailData.label
    }
  })

  if (existDictDetail) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '标签已存在'
    }
    return
  }

  // 创建字典详情
  const dictDetail = await DictDetail.create({
    ...dictDetailData,
    create_by: ctx.state.user.username
  })

  ctx.status = 201
  ctx.body = {
    code: 201,
    message: '创建成功',
    data: dictDetail
  }
}

// 更新字典详情
export const update = async ctx => {
  const { id } = ctx.params
  const dictDetailData = ctx.request.body

  // 查询字典详情
  const dictDetail = await DictDetail.findByPk(id)

  if (!dictDetail) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '字典详情不存在'
    }
    return
  }

  // 检查标签是否已存在
  if (dictDetailData.label !== dictDetail.label || dictDetailData.dict_id !== dictDetail.dict_id) {
    const existDictDetail = await DictDetail.findOne({
      where: {
        dict_id: dictDetailData.dict_id,
        label: dictDetailData.label,
        detail_id: {
          [Op.ne]: id
        }
      }
    })

    if (existDictDetail) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '标签已存在'
      }
      return
    }
  }

  // 更新字典详情信息
  await dictDetail.update({
    ...dictDetailData,
    update_by: ctx.state.user.username
  })

  ctx.body = {
    code: 200,
    message: '更新成功'
  }
}

// 删除字典详情
export const remove = async ctx => {
  const { id } = ctx.params

  // 查询字典详情
  const dictDetail = await DictDetail.findByPk(id)

  if (!dictDetail) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '字典详情不存在'
    }
    return
  }

  // 删除字典详情
  await dictDetail.destroy()

  ctx.body = {
    code: 200,
    message: '删除成功'
  }
}

// 根据字典名获取字典详情
export const getByDictName = async ctx => {
  const { dictName } = ctx.params

  // 查询字典
  const dict = await Dict.findOne({
    where: { name: dictName }
  })

  if (!dict) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '字典不存在'
    }
    return
  }

  // 查询字典详情
  const dictDetails = await DictDetail.findAll({
    where: { dict_id: dict.dict_id },
    order: [['dict_sort', 'ASC']]
  })

  ctx.body = {
    code: 200,
    data: dictDetails
  }
}
