import fs from 'node:fs'
import path from 'node:path'
import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const db = {}
const __dirname = import.meta.dirname

// 递归读取目录下的所有模型文件
const readModelFiles = dir => {
  let files = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      // 如果是目录，递归读取
      files = files.concat(readModelFiles(fullPath))
    } else if (item.indexOf('.') !== 0 && item !== 'index.js' && item.slice(-3) === '.js') {
      // 如果是 JS 文件且不是 index.js
      files.push(fullPath)
    }
  }

  return files
}

// 导入模型文件并注册到db对象中
const loadModels = async () => {
  const modelFiles = readModelFiles(__dirname)

  for (const file of modelFiles) {
    const module = await import(file)
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

await loadModels()

db.sequelize = sequelize

export default db
