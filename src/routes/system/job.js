import Router from 'koa-router'
import authMiddleware from '../../middlewares/auth.js'
import * as jobController from '../../controllers/system/job.js'

const router = new Router({ prefix: '/api/system/jobs' })

router.get('/', authMiddleware, jobController.list)
router.get('/all', authMiddleware, jobController.all)
router.get('/:id', authMiddleware, jobController.detail)
router.post('/', authMiddleware, jobController.create)
router.put('/:id', authMiddleware, jobController.update)
router.delete('/:id', authMiddleware, jobController.remove)

export default router
