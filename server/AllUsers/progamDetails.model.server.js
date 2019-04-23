var db = require('../databse');
var programDetailsDB = db.ProgramDetails; //require('../models/geoLocation.model');

db.sequelize.sync();

module.exports = programDetailsDB;

programDetailsDB.addProgramDetails = addProgramDetails;


function addProgramDetails(eventId, programDetails){
    console.log('the program details received', programDetails);
    return Promise.all(programDetails.map(function(detail){
            detail.eventId = eventId;
            detail.sessionStartTime = detail.time.from;
            detail.sessionEndTime = detail.time.to;
            detail.title = detail.dailyDetails ? detail.dailyDetails.title : null;
            detail.details = detail.dailyDetails ? detail.dailyDetails.details : null;
            detail.videoLink = detail.dailyDetails ? detail.dailyDetails.videoLink : null;
            return programDetailsDB.create(detail);
        })
    )
    .then(function(result){
        console.log('the result after add all program details: ', result);
        return result;
    });
}

