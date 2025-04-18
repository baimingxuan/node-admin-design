export default (sequelize, DataTypes) => {
  // 定义部门模型
  const Dept = sequelize.define(
    'Dept',
    {
      dept_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        comment: '部门ID'
      },
      pid: {
        type: DataTypes.BIGINT,
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
        comment: '创建者'
      },
      update_by: {
        type: DataTypes.STRING(100),
        comment: '更新者'
      },
      create_time: {
        type: DataTypes.DATE,
        comment: '创建时间'
      },
      update_time: {
        type: DataTypes.DATE,
        comment: '更新时间'
      }
    },
    {
      tableName: 'sys_dept',
      comment: '系统部门'
    }
  )

  Dept.associate = function (models) {
    // 部门与用户一对多关系
    Dept.hasMany(models.User, {
      foreignKey: 'dept_id'
    })
  }

  return Dept
}
