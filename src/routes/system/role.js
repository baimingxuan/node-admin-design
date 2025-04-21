import Router from 'koa-router'
import authMiddleware from '../../middlewares/auth.js'
import * as roleController from '../../controllers/system/role.js'

const router = new Router({
  prefix: '/api/system/roles'
})

router.get('/', authMiddleware, roleController.list)
router.get('/all', authMiddleware, roleController.all)
router.get('/:id', authMiddleware, roleController.detail)
router.get('/:id/menus', authMiddleware, roleController.menus)
router.post('/', authMiddleware, roleController.create)
router.put('/:id', authMiddleware, roleController.update)
router.delete('/:id', authMiddleware, roleController.delete)

export default router
