import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import session from 'koa-session'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import logger from 'koa-logger'
import errorHandler from './middlewares/error.js'
import config from './config/index.js'
import router from './routes/index.js'
import db from './models/index.js'

const app = new Koa()

// 配置会话
app.keys = [config.session.secret] // 用于签名会话ID cookie的密钥
app.use(session(config.sessionConf, app))

// 安全头
app.use(helmet())

// 跨域
app.use(
  cors({
    credentials: true // 允许发送凭证
  })
)

// 日志
app.use(logger())

// 错误处理
app.use(errorHandler)

// 解析请求体
app.use(bodyParser())

// 路由挂载
app.use(router.routes()).use(router.allowedMethods())

// 同步所有模型
db.sequelize.sync().catch(err => {
  console.error('数据库连接失败:', err)
})

export default app
