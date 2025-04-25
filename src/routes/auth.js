import Router from 'koa-router'
import authMiddleware from '../middlewares/auth.js'
import * as authController from '../controllers/auth.js'

const router = new Router({
  prefix: '/api/auth'
})

router.get('/captcha', authController.captcha)
router.post('/login', authController.login)
router.get('/info', authMiddleware, authController.info)
router.delete('/logout', authMiddleware, authController.logout)

export default router
