export default {
  environment: 'prod',
  port: 3000,
  database: {
    database: 'admin-design',
    username: 'root',
    password: '123456789',
    host: 'localhost',
    port: 3306
  },
  jwt: {
    secret: 'admin-design_jwt-secret',
    expiresIn: 60 * 60 * 24
  },
  session: {
    secret: 'admin-design_session-secret' // 用于签名会话ID cookie的密钥
  },
  sessionConf: {
    key: 'koa:sess', // cookie键名
    maxAge: 86400000, // cookie有效期，默认1天
    autoCommit: true, // 自动提交头部
    overwrite: true, // 是否可以覆盖
    httpOnly: true, // 是否仅服务器可访问
    signed: true, // 是否签名
    rolling: false, // 是否每次响应时刷新会话有效期
    renew: false // 是否在会话快过期时刷新会话
  }
}
