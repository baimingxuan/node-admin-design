import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import logger from 'koa-logger'
import { errorHandler } from './middlewares/error.js'
import userRouter from './routes/system/user.js'
import authRouter from './routes/auth.js'
import roleRouter from './routes/system/role.js'
import db from './models/index.js'

const app = new Koa()

// 安全头
app.use(helmet())

// 跨域
app.use(cors())

// 日志
app.use(logger())

// 错误处理
app.use(errorHandler)

// 解析请求体
app.use(bodyParser())

// 路由挂载
app.use(authRouter.routes()).use(authRouter.allowedMethods())
app.use(userRouter.routes()).use(userRouter.allowedMethods())
app.use(roleRouter.routes()).use(roleRouter.allowedMethods())

// 同步所有模型
db.sequelize.sync().catch(err => {
  console.error('数据库连接失败:', err)
})

export default app
