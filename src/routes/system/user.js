import Router from 'koa-router'
import authMiddleware from '../../middlewares/auth.js'
import * as userController from '../../controllers/system/user.js'

const router = new Router({
  prefix: '/api/system/users'
})

router.get('/', authMiddleware, userController.list)
router.get('/:id', authMiddleware, userController.detail)
router.post('/', authMiddleware, userController.create)
router.put('/:id', authMiddleware, userController.update)
router.delete('/:id', authMiddleware, userController.remove)

export default router
