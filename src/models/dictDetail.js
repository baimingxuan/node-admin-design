export default (sequelize, DataTypes) => {
  // 定义字典详情模型
  const DictDetail = sequelize.define(
    'DictDetail',
    {
      detail_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        comment: '字典详情ID'
      },
      dict_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: '字典ID'
      },
      label: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '字典标签'
      },
      value: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '字典值'
      },
      dict_sort: {
        type: DataTypes.INTEGER,
        defaultValue: 999,
        comment: '排序'
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
      tableName: 'sys_dict_detail',
      comment: '系统字典详情'
    }
  )

  DictDetail.associate = function (models) {
    // 字典详情与字典多对一关系
    DictDetail.belongsTo(models.Dict, {
      foreignKey: 'dict_id'
    })
  }

  return DictDetail
}
