var Sequelize = require('sequelize');
var db = require('../databse');

var Events = db.define('event', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    details: {
        type: Sequelize.STRING
    },
    startingDate:{
        type: Sequelize.DATE
    },
    expiryDate:{
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
    dailyDetails:{
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
    approved: {
        type: Sequelize.BOOLEAN
    },
    special:{
        type: Sequelize.BOOLEAN
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
});

module.exports = Events;



/*
on event creation:
event details:  { 
  on event:
    name: 'Event 1',
    details: 'Details',
    startingDate: '2019-02-28T22:00:00.000Z',
    expiryDate: '2019-03-31T21:00:00.000Z',
    sessionStartTime: '1970-01-01T14:00:00.000Z',
    sessionEndTime: '1970-01-01T16:00:00.000Z',
    price: '200',
    termsAndConditions: 'Terms and conditions 1',
    daysPerWeek: [ 6, 1, 3 ],
    
  on Category:
    category: 'Category 1',
  
  on sub-Category:
    subcategory: 'sub category 1',
  
  on ageGroup:
    ageGroup: { ageGroupTitle: 'Junior', ageGroupFrom: 4, ageGroupTo: 6 },
  
  address: 'Amman',
  eventDays:
   [ 'Sat Mar 02 2019',
     'Mon Mar 04 2019',
     'Wed Mar 06 2019',
     'Sat Mar 09 2019',
     'Mon Mar 11 2019',
     'Wed Mar 13 2019',
     'Sat Mar 16 2019',
     'Mon Mar 18 2019',
     'Wed Mar 20 2019',
     'Sat Mar 23 2019',
     'Mon Mar 25 2019',
     'Wed Mar 27 2019',
     'Sat Mar 30 2019' ],
  coordinates: [ 35.8770069, 32.003292099999996 ],
  programDailyDetails: { 'Sat Mar 02 2019': { title: 'Day 1', details: 'Day one details', videoLink: '' } } }
*/