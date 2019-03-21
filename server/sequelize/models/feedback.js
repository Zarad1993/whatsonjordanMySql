'use strict';
module.exports = (sequelize, DataTypes) => {
  const feedback = sequelize.define('feedback', {
    details: DataTypes.STRING
  }, {});
  feedback.associate = function(models) {
    // associations can be defined here
    feedback.belongsTo(models.member, { onDelete: 'cascade' });
    feedback.belongsTo(models.event, { onDelete: 'cascade' });
  };
  return feedback;
};