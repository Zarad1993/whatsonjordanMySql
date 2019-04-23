var Sequelize = require('sequelize');
var db = require('../databse');

var ProgramDetails = db.sequelize.define('programDetails', {
    date: {
        type: Sequelize.DATE
    },
    sessionStartTime: {
        type: Sequelize.DATE
    },
    sessionEndTime: {
        type: Sequelize.DATE
    },
    title:{
        type: Sequelize.STRING
    },
    details: {
        type: Sequelize.STRING
    },
    videoLink: {
        type: Sequelize.STRING
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

module.exports = ProgramDetails;



/*
eventId --> from the relation woth the event (1:1)
from event.programDetails array:
    date = event.eventDays.date -->  "Sat Jun 01 2019"
    sessionStartTime = event.eventDays.time.from --> 'Time'
    sessionEndTime = event.eventDays.time.to --> 'Time'
    title = event.eventDays.dailyDetails.title --> 'title'
    details = event.eventDays.dailyDetails.details --> 'details'
    videoLink = event.eventDays.dailyDetails.videoLink --> 'videoLink'
*/