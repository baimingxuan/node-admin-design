export default async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.error('服务器错误', err)

    // 设置状态码
    ctx.status = err.status || 500

    // 设置响应体
    ctx.body = {
      code: ctx.status,
      message: err.message || '服务器内部错误'
    }

    // 记录错误日志
    ctx.app.emit('error', err, ctx)
  }
}
