import fs from 'node:fs'
import path from 'node:path'
import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const db = {}
const __dirname = import.meta.dirname

// 读取当前目录下的所有模型文件
const modelFiles = fs.readdirSync(__dirname).filter(file => {
  return file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js'
})

// 导入模型文件并注册到db对象中
const importModels = async () => {
  for (const file of modelFiles) {
    const modulePath = path.join(__dirname, file)
    const module = await import(modulePath)
    const model = module.default(sequelize, DataTypes)
    db[model.name] = model
  }

  // 建立模型之间的关联关系
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })
}

await importModels()

db.sequelize = sequelize

export default db
