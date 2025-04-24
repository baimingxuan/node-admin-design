import Router from 'koa-router'
import authMiddleware from '../../middlewares/auth.js'
import * as dictController from '../../controllers/system/dict.js'

const router = new Router({ prefix: '/system/dict' })

// 字典管理路由
router.get('/', authMiddleware, dictController.list)
router.get('/all', authMiddleware, dictController.all)
router.get('/:id', authMiddleware, dictController.detail)
router.post('/', authMiddleware, dictController.create)
router.put('/:id', authMiddleware, dictController.update)
router.delete('/:id', authMiddleware, dictController.remove)

export default router
