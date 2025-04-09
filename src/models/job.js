export default (sequelize, DataTypes) => {
  // 定义岗位模型
  const Job = sequelize.define(
    'Job',
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
      tableName: 'sys_job',
      comment: '系统岗位'
    }
  )

  Job.associate = function (models) {
    // 岗位与用户多对多关系
    Job.belongsToMany(models.User, {
      through: 'sys_users_jobs',
      foreignKey: 'job_id',
      otherKey: 'user_id'
    })
  }

  return Job
}
