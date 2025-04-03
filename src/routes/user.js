import Router from 'koa-router'
import userController from '../controllers/user.js'

const router = new Router({
  prefix: '/api/user'
})

router.get('/getUserList', userController.getUserList)
router.get('/getUserDetail/:id', userController.getUserDetail)

export default router
