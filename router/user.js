const express = require('express')
const boom = require('boom')
const jwt = require('jsonwebtoken')
const Result = require('../models/Result')
const { login, findUser } = require('../controller/user')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')
const { body, validationResult } = require('express-validator')

const router = express.Router()

router.post(
  '/login',
  [
    body('username').isString().withMessage('用户名必须为字符串'),
    body('password').isString().withMessage('密码必须为字符串')
  ],
  (req, res, next) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors
      next(boom.badRequest(msg))
    } else {
      let { username, password } = req.body

      login(username, password).then(user => {
        if (!user || user.lenght === 0) {
          new Result('登录失败').fail(res)
        } else {
          const token = jwt.sign(
            { username },
            PRIVATE_KEY,
            { expiresIn: JWT_EXPIRED }
          )
          new Result({ token }, '登录成功').success(res)
        }
      })
    }
})

module.exports = router
