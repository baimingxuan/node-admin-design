export default (sequelize, DataTypes) => {
  // 定义角色模型
  const Role = sequelize.define(
    'Role',
    {
      role_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        comment: '角色ID'
      },
      name: {
        type: DataTypes.STRING(100),
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
        type: DataTypes.STRING,
        allowNull: true,
        comment: '角色描述'
      },
      data_scope: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '数据权限'
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
      tableName: 'sys_role',
      comment: '系统角色'
    }
  )

  Role.associate = function (models) {
    // 角色与用户多对多关系
    Role.belongsToMany(models.User, {
      through: 'sys_users_roles',
      foreignKey: 'role_id',
      otherKey: 'user_id'
    })

    // 角色与菜单多对多关系
    Role.belongsToMany(models.Menu, {
      through: 'sys_roles_menus',
      foreignKey: 'role_id',
      otherKey: 'menu_id'
    })
  }

  return Role
}
