import Router from 'koa-router'
import authMiddleware from '../../middlewares/auth.js'
import * as dictDetailController from '../../controllers/system/dictDetail.js'

const router = new Router({ prefix: '/system/dictDetail' })

// 字典详情管理路由
router.get('/', authMiddleware, dictDetailController.list)
router.get('/:id', authMiddleware, dictDetailController.detail)
router.get('/dict/:dictName', authMiddleware, dictDetailController.getByDictName)
router.post('/', authMiddleware, dictDetailController.create)
router.put('/:id', authMiddleware, dictDetailController.update)
router.delete('/:id', authMiddleware, dictDetailController.remove)

export default router
