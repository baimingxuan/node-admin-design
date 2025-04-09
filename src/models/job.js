import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Job = sequelize.define(
  'sys_job',
  {
    job_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: '岗位ID'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '岗位名称'
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '岗位状态'
    },
    job_sort: {
      type: DataTypes.INTEGER,
      defaultValue: 999,
      comment: '岗位排序'
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
    comment: '系统岗位'
  }
)

export default Job
