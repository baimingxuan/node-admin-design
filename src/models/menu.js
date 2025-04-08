import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Menu = sequelize.define(
  'sys_menu',
  {
    menu_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: '菜单ID'
    },
    pid: {
      type: DataTypes.BIGINT,
      allowNull: false,
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
      allowNull: true,
      comment: '组件名称'
    },
    component: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '组件路径'
    },
    menu_sort: {
      type: DataTypes.INTEGER,
      defaultValue: 999,
      comment: '菜单排序'
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '菜单图标'
    },
    path: {
      type: DataTypes.STRING,
      allowNull: true,
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
      allowNull: true,
      comment: '权限标识'
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
    tableName: 'sys_menu',
    comment: '系统菜单'
  }
)

export default Menu
