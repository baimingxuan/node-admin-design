import fs from 'node:fs'
import path from 'node:path'
import Router from 'koa-router'

const router = new Router()
const __dirname = import.meta.dirname

// 动态导入路由文件
const loadRoutes = async dir => {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // 如果是目录，递归加载
      await loadRoutes(filePath)
    } else if (file !== 'index.js' && file.endsWith('.js')) {
      // 如果是 JS 文件且不是 index.js，动态导入
      const routerModule = await import(filePath)
      const routerInstance = routerModule.default

      if (routerInstance && routerInstance.routes) {
        // 注册子路由
        router.use(routerInstance.routes(), routerInstance.allowedMethods())
        console.log(`路由已加载: ${filePath}`)
      }
    }
  }
}

// 加载所有路由
;(async () => {
  try {
    await loadRoutes(__dirname)
    console.log('所有路由加载完成')
  } catch (error) {
    console.error('路由加载失败:', error)
  }
})()

export default router
