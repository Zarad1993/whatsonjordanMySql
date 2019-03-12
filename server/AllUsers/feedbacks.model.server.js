var db = require('../databse');
var feedbacksDB = require('../models/feedback.model');
var Event = require('../models/event.model');
var Member = require('../models/member.model');

db.sync();

module.exports = feedbacksDB;

feedbacksDB.submitFeedback = submitFeedback;
feedbacksDB.getMemberFeedbacks = getMemberFeedbacks;
feedbacksDB.getAllFeedbacks = getAllFeedbacks;


function submitFeedback(feedbackObject){
    var memberId = feedbackObject.memberId;
    var eventId = feedbackObject.eventId;
    // var feedbackText = feedbackObject.details;
    return feedbacksDB
        .create(feedbackObject)
        .then(function(feedback){
            feedback.setMember(memberId);
            feedback.setEvent(eventId);
            console.log('the created feedback: ', feedback);
            return feedback;
        })
}


function getMemberFeedbacks(memberId){
    return feedbacksDB
            .findAll({
                        where: {memberId: memberId},
                        include: [{model: Event, attributes: ['name']}]
                    });
}

function getAllFeedbacks(){
    return feedbacksDB.findAll({
                            include: [
                                    {model: Event, attributes: ['name']},
                                    {model: Member, attributes: ['firstName', 'middleName', 'lastName']}
                    ]});
}