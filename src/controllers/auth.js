import jwt from 'jsonwebtoken'
import svgCaptcha from 'svg-captcha'
import db from '../models/index.js'
import config from '../config/index.js'

const { User, Role, Menu } = db

// 生成验证码
export const captcha = async ctx => {
  // 创建验证码
  const captcha = svgCaptcha.create({
    size: 4, // 验证码长度
    ignoreChars: '0o1il', // 排除容易混淆的字符
    noise: 2, // 干扰线条数量
    color: true, // 验证码颜色
    background: '#f0f0f0' // 背景色
  })

  // 将验证码存入会话
  ctx.session.captcha = captcha.text.toLowerCase()

  // 设置响应头
  ctx.type = 'image/svg+xml'
  ctx.body = captcha.data
}

// 用户登录
export const login = async ctx => {
  const { username, password, captcha } = ctx.request.body

  // 验证验证码
  if (!captcha || !ctx.session.captcha || captcha.toLowerCase() !== ctx.session.captcha) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '验证码错误'
    }
    return
  }

  // 清除验证码，防止重复使用
  ctx.session.captcha = null

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
