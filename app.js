const express = require('express')
const router = require('./router')
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 3000

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/', router)

app.listen(port, () => {
  console.log(`http服务启动成功，端口为${port}`)
})
