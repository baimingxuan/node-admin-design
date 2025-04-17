import bcrypt from 'bcryptjs'

export default (sequelize, DataTypes) => {
  // 定义用户模型
  const User = sequelize.define(
    'User',
    {
      user_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID'
      },
      dept_id: {
        type: DataTypes.BIGINT,
        comment: '部门名称'
      },
      username: {
        type: DataTypes.STRING(100),
        unique: true,
        comment: '用户名'
      },
      nick_name: {
        type: DataTypes.STRING(100),
        comment: '昵称'
      },
      gender: {
        type: DataTypes.STRING(2),
        comment: '性别'
      },
      phone: {
        type: DataTypes.STRING(180),
        comment: '手机号码'
      },
      email: {
        type: DataTypes.STRING(180),
        unique: true,
        comment: '邮箱'
      },
      avatar_name: {
        type: DataTypes.STRING,
        comment: '头像地址'
      },
      avatar_path: {
        type: DataTypes.STRING,
        comment: '头像真实路径'
      },
      password: {
        type: DataTypes.STRING,
        comment: '密码',
        set(value) {
          const salt = bcrypt.genSaltSync(10)
          const pwd = bcrypt.hashSync(value, salt)
          this.setDataValue('password', pwd)
        }
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        comment: '是否为admin账号'
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
        comment: '状态: 1启用、0禁用'
      },
      create_by: {
        type: DataTypes.STRING(100),
        comment: '创建者'
      },
      update_by: {
        type: DataTypes.STRING(100),
        comment: '更新者'
      },
      pwd_reset_time: {
        type: DataTypes.DATE,
        comment: '修改密码的时间'
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
      tableName: 'sys_user',
      comment: '系统用户'
    }
  )

  User.associate = function (models) {
    // 用户与角色多对多关系
    User.belongsToMany(models.Role, {
      through: 'sys_users_roles',
      foreignKey: 'user_id',
      otherKey: 'roles'
    })

    // 用户与岗位多对多关系
    User.belongsToMany(models.Job, {
      through: 'sys_users_jobs',
      foreignKey: 'user_id',
      otherKey: 'job_id'
    })

    // 用户与部门一对多关系
    User.belongsTo(models.Dept, {
      foreignKey: 'dept_id'
    })
  }

  // 验证密码
  User.prototype.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
  }

  return User
}
