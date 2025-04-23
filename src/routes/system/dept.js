import Router from 'koa-router'
import authMiddleware from '../../middlewares/auth.js'
import * as deptController from '../../controllers/system/dept.js'

const router = new Router({
  prefix: '/api/system/depts'
})

router.get('/tree', authMiddleware, deptController.tree)
router.get('/', authMiddleware, deptController.list)
router.get('/all', authMiddleware, deptController.all)
router.get('/superior', authMiddleware, deptController.superior)
router.get('/:id', authMiddleware, deptController.detail)
router.post('/', authMiddleware, deptController.create)
router.put('/:id', authMiddleware, deptController.update)
router.delete('/:id', authMiddleware, deptController.remove)

export default router
