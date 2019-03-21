'use strict';
module.exports = (sequelize, DataTypes) => {
  const member = sequelize.define('member', {
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    DOB: DataTypes.DATE,
    profileImage: DataTypes.STRING,
    gender: DataTypes.STRING
  }, {});
  member.associate = function(models) {
    // associations can be defined here
    member.belongsTo(models.school, { onDelete: 'cascade' });
    member.belongsTo(models.contact, { onDelete: 'cascade' });
    member.belongsTo(models.address, { onDelete: 'cascade' });
    member.belongsTo(models.nationality, { onDelete: 'cascade' });
    member.belongsTo(models.grade, { onDelete: 'cascade' });
    member.belongsToMany(models.event, { through: 'MemberEvent', onDelete: 'cascade' });
  };
  return member;
};