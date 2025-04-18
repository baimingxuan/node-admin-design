import jwt from 'jsonwebtoken'
import db from '../models/index.js'
import config from '../config/index.js'

const { User, Role, Menu } = db

// 用户登录
export const login = async ctx => {
  const { username, password } = ctx.request.body

  // 查询用户
  const user = await User.findOne({
    where: { username },
    include: [
      {
        model: Role,
        through: {
          attributes: []
        },
        include: [
          {
            model: Menu,
            through: {
              attributes: []
            }
          }
        ]
      }
    ]
  })

  // 验证用户是否存在
  if (!user) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '用户名或密码错误'
    }
    return
  }

  // 验证密码
  if (!user.comparePassword(password)) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '用户名或密码错误'
    }
    return
  }

  // 验证用户状态
  if (!user.enabled) {
    ctx.status = 403
    ctx.body = {
      code: 403,
      message: '用户已被禁用'
    }
    return
  }

  // 生成 token
  const token = jwt.sign({ id: user.user_id, username: user.username }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  })

  // 返回用户信息和 token
  ctx.body = {
    code: 200,
    message: '登录成功',
    data: {
      token,
      user: {
        id: user.user_id,
        username: user.username,
        nickname: user.nick_name,
        avatar: user.avatar_path,
        email: user.email,
        roles: user.Roles?.map(role => ({
          id: role.role_id,
          name: role.name,
          level: role.level,
          description: role.description
        }))
      }
    }
  }
}

// 获取用户信息
export const info = async ctx => {
  const user = ctx.state.user

  ctx.body = {
    code: 200,
    data: {
      user: {
        id: user.user_id,
        username: user.username,
        nickname: user.nick_name,
        avatar: user.avatar_path,
        email: user.email,
        roles: user.Roles.map(role => ({
          id: role.role_id,
          name: role.name,
          level: role.level,
          description: role.description
        }))
      }
    }
  }
}

// 用户登出
export const logout = async ctx => {
  ctx.body = {
    code: 200,
    message: '登出成功'
  }
}
