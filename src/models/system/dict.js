export default (sequelize, DataTypes) => {
  // 定义字典模型
  const Dict = sequelize.define(
    'Dict',
    {
      dict_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        comment: '字典ID'
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: '字典名称'
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '字典描述'
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
      tableName: 'sys_dict',
      comment: '系统字典'
    }
  )

  Dict.associate = function (models) {
    // // 字典与字典详情一对多关系
    Dict.hasMany(models.DictDetail, {
      foreignKey: 'dict_id'
    })
  }

  return Dict
}
