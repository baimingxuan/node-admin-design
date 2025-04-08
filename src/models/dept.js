import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Dept = sequelize.define(
  'sys_dept',
  {
    dept_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: '部门ID'
    },
    pid: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: '上级部门'
    },
    sub_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '子部门数目'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '部门名称'
    },
    dept_sort: {
      type: DataTypes.INTEGER,
      defaultValue: 999,
      comment: '部门排序'
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '状态'
    },
    create_by: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '创建者'
    },
    update_by: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '更新者'
    }
  },
  {
    tableName: 'sys_dept',
    comment: '系统部门'
  }
)

export default Dept
