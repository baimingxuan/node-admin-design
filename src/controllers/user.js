import User from '../models/system/user.js'

class userController {
  static async getUserList(ctx) {
    const { pageNum = 1, pageSize = 10 } = ctx.query

    try {
      const userList = await User.findAll({
        offset: (pageNum - 1) * pageSize,
        limit: pageSize * 1
      })
      ctx.body = {
        code: 200,
        data: userList
      }
    } catch {
      ctx.status = 500
      ctx.body = { code: 500, msg: '查询失败' }
    }
  }

  static async getUserDetail(ctx) {
    const { id } = ctx.params

    try {
      const userDetail = await User.findByPk(id)

      ctx.body = {
        code: 200,
        data: userDetail
      }
    } catch {
      ctx.status = 500
      ctx.body = { code: 500, msg: '查询失败' }
    }
  }
}

export default userController
