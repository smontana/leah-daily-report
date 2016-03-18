module.exports = function(sequelize) {
  var Sequelize = require('sequelize');
  var singular_model_name = 'Report';
  var plural_model_name = 'Reports';

  var model = sequelize.define(singular_model_name, {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    report_id: { type: Sequelize.STRING },
    name: { type: Sequelize.STRING },
    description: { type: Sequelize.TEXT },
    x_axis: { type: Sequelize.STRING },
    y_axis: { type: Sequelize.STRING },
    created_at: { type: Sequelize.DATE },
    updated_at: { type: Sequelize.DATE }
  },{
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
    tableName: plural_model_name
  });

  return {
    model: model,
    model_name: singular_model_name
  }
}