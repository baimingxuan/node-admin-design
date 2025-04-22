import Router from 'koa-router'
import authMiddleware from '../../middlewares/auth.js'
import * as menuController from '../../controllers/system/menu.js'

const router = new Router({
  prefix: '/api/system/menus'
})

router.get('/tree', authMiddleware, menuController.tree)
router.get('/', authMiddleware, menuController.list)
router.get('/:id', authMiddleware, menuController.detail)
router.post('/', authMiddleware, menuController.create)
router.put('/:id', authMiddleware, menuController.update)
router.delete('/:id', authMiddleware, menuController.remove)

export default router
