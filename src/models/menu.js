export default (sequelize, DataTypes) => {
  // 定义菜单模型
  const Menu = sequelize.define(
    'Menu',
    {
      menu_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        comment: '菜单ID'
      },
      pid: {
        type: DataTypes.BIGINT,
        comment: '上级菜单ID'
      },
      sub_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '子菜单数目'
      },
      type: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '菜单类型'
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '菜单标题'
      },
      name: {
        type: DataTypes.STRING(100),
        comment: '组件名称'
      },
      component: {
        type: DataTypes.STRING,
        comment: '组件路径'
      },
      menu_sort: {
        type: DataTypes.INTEGER,
        defaultValue: 999,
        comment: '菜单排序'
      },
      icon: {
        type: DataTypes.STRING(100),
        comment: '菜单图标'
      },
      path: {
        type: DataTypes.STRING,
        comment: '链接地址'
      },
      iframe: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '是否外链'
      },
      cache: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '是否缓存'
      },
      hidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '是否隐藏'
      },
      permission: {
        type: DataTypes.STRING,
        comment: '权限标识'
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
      tableName: 'sys_menu',
      comment: '系统菜单'
    }
  )

  Menu.associate = function (models) {
    // 菜单与角色多对多关系
    Menu.belongsToMany(models.Role, {
      through: 'sys_roles_menus',
      foreignKey: 'menu_id',
      otherKey: 'role_id'
    })
  }

  return Menu
}
