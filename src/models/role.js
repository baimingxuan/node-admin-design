import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Role = sequelize.define(
  'sys_role',
  {
    role_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: '角色ID'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: '角色名称'
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '角色级别'
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '角色描述'
    },
    data_scope: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '数据权限'
    },
    create_by: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '创建者'
    },
    update_by: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '更新者'
    }
  },
  {
    tableName: 'sys_role',
    comment: '系统角色'
  }
)
export default Role
