'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      details: {
        type: Sequelize.STRING
      },
      startingDate: {
        type: Sequelize.DATE
      },
      expiryDate: {
        type: Sequelize.DATE
      },
      sessionStartTime: {
        type: Sequelize.DATE
      },
      sessionEndTime: {
        type: Sequelize.DATE
      },
      daysPerWeek: {
        type: Sequelize.JSON
      },
      dailyDetails: {
        type: Sequelize.JSON
      },
      images: {
        type: Sequelize.JSON
      },
      price: {
        type: Sequelize.STRING
      },
      termsAndConditions: {
        type: Sequelize.STRING
      },
      originalEventId: {
        type: Sequelize.STRING
      },
      approved: {
        type: Sequelize.BOOLEAN
      },
      special: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('events');
  }
};