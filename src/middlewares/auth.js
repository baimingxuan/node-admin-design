import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import db from '../models/index.js'

const { User, Role, Menu } = db

export default async (ctx, next) => {
  try {
    // 获取 token
    const token = ctx.header.authorization ? ctx.header.authorization.split(' ')[1] : null

    if (!token) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        message: '未登录或 token 已过期'
      }
      return
    }

    // 验证 token
    const decoded = jwt.verify(token, config.jwt.secret)

    // 查询用户信息
    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: Role,
          through: { attributes: [] },
          include: [
            {
              model: Menu,
              through: { attributes: [] }
            }
          ]
        }
      ]
    })

    if (!user) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        message: '用户不存在'
      }
      return
    }

    if (!user.enabled) {
      ctx.status = 403
      ctx.body = {
        code: 403,
        message: '用户已被禁用'
      }
      return
    }

    // 将用户信息添加到上下文中
    ctx.state.user = user

    await next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      ctx.status = 401
      ctx.body = {
        code: 401,
        message: 'token 已过期'
      }
    } else if (err.name === 'JsonWebTokenError') {
      ctx.status = 401
      ctx.body = {
        code: 401,
        message: 'token 无效'
      }
    } else {
      throw err
    }
  }
}
