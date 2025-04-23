import { Op } from 'sequelize'
import db from '../../models/index.js'

const { Job } = db

// 获取岗位列表
export const list = async ctx => {
  const { page = 1, size = 10, name, enabled } = ctx.query

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

  // 查询岗位列表
  const { count, rows } = await Job.findAndCountAll({
    where,
    offset: (page - 1) * size,
    limit: parseInt(size),
    order: [['job_sort', 'ASC']]
  })

  ctx.body = {
    code: 200,
    data: {
      content: rows,
      totalElements: count
    }
  }
}

// 获取岗位详情
export const detail = async ctx => {
  const { id } = ctx.params

  const job = await Job.findByPk(id)

  if (!job) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '岗位不存在'
    }
    return
  }

  ctx.body = {
    code: 200,
    data: job
  }
}

// 创建岗位
export const create = async ctx => {
  const jobData = ctx.request.body
  const { name } = jobData

  // 检查岗位名是否已存在
  const existJob = await Job.findOne({
    where: { name: name }
  })

  if (existJob) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '岗位名已存在'
    }
    return
  }

  // 创建岗位
  const job = await Job.create({
    ...jobData,
    create_by: ctx.state.user.username
  })

  ctx.status = 201
  ctx.body = {
    code: 201,
    message: '创建成功',
    data: job
  }
}

// 更新岗位
export const update = async ctx => {
  const { id } = ctx.params
  const jobData = ctx.request.body

  // 查询岗位
  const job = await Job.findByPk(id)

  if (!job) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '岗位不存在'
    }
    return
  }

  // 检查岗位名是否已存在
  if (jobData.name !== job.name) {
    const existJob = await Job.findOne({
      where: {
        name: jobData.name,
        job_id: {
          [Op.ne]: id
        }
      }
    })

    if (existJob) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '岗位名已存在'
      }
      return
    }
  }

  // 更新岗位信息
  await job.update({
    ...jobData,
    update_by: ctx.state.user.username
  })

  ctx.body = {
    code: 200,
    message: '更新成功'
  }
}

// 删除岗位
export const remove = async ctx => {
  const { id } = ctx.params

  // 查询岗位
  const job = await Job.findByPk(id)

  if (!job) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: '岗位不存在'
    }
    return
  }

  // 检查是否有用户关联此岗位
  const userCount = await job.countUsers()

  if (userCount > 0) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '岗位已分配给用户，无法删除'
    }
    return
  }

  // 删除岗位
  await job.destroy()

  ctx.body = {
    code: 200,
    message: '删除成功'
  }
}

// 获取所有岗位
export const all = async ctx => {
  const jobs = await Job.findAll({
    where: { enabled: true },
    order: [['job_sort', 'ASC']]
  })

  ctx.body = {
    code: 200,
    data: jobs
  }
}
