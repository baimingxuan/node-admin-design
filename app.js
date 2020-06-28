const express = require('express')
const port = 3000
const router = require('./router/index')

const app = express()

app.use('/', router)

app.listen(3000, () => {
  console.log(`http服务启动成功，端口为${port}`)
})
