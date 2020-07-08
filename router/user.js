const express = require('express')
const Result = require('../models/Result')

const router = express.Router()

router.post('/login', (req, res) => {
  const { username, password } = res.body
  if (username === 'admin' && password === 'admin') {
    new Result('登录成功！').success(res)
  } else {
    new Result('登录失败！').fail(res)
  }
})

router.use('/info', (req, res, next) => {
  res.json('user info...')
})

module.exports = router
