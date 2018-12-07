var mongoose = require('mongoose');
var eventsSchema = require('./events.schema.server.js');

var usersDB = require('../AllUsers/users.model.server.js');

var eventsDB = mongoose.model('eventsDB', eventsSchema);

module.exports = eventsDB;

eventsDB.findEventByEventId = findEventByEventId;
eventsDB.findEventsByMakerId = findEventsByMakerId;
eventsDB.getAllEvents = getAllEvents;
eventsDB.addNewEvent = addNewEvent;
eventsDB.updateEvent = updateEvent;
eventsDB.removeEvent = removeEvent;
eventsDB.updateEventByAdmin = updateEventByAdmin;
eventsDB.addMemberToEvent = addMemberToEvent;
eventsDB.addToDiscountedMembers = addToDiscountedMembers;
eventsDB.addExpense = addExpense;
eventsDB.addToFrozeMembers = addToFrozeMembers;
eventsDB.removeFrozen = removeFrozen;
// eventsDB.createMakerEventsList = createMakerEventsList;

function removeFrozen(ids){
	// console.log(ids);
	var eventId = ids.eventId;
	var userId = ids.userId;
	var originalEventId = ids.originalEventId;
	return eventsDB
				.findById(eventId)
				.then(function(event){
					console.log('the found event is:');
					console.log(event);
					for(var f in event.frozeMembers){
						if(event.frozeMembers[f].userId === userId){
							// instead of remove the frozen members set the compensated to true
							// event.frozeMembers.splice(f,1);
							event.frozeMembers[f].compensated = true;
							console.log('compensated after is: ',event.frozeMembers[f].compensated);
						}
					}
					return event.save();
					// return usersDB.findById(userId);
				})
				// .then(function(user){
				.then(
					usersDB
						.findById(userId)
						.then(function(user){
							console.log('the user is: ');
							console.log(user);
							for(var i in user.userEventParameters){
								if(user.userEventParameters[i].eventId === originalEventId){
									user.userEventParameters[i].freezeDays.splice(0, user.userEventParameters[i].freezeDays.length);
								}
							}
							return user.save();
							
						})

					);
}




function addToFrozeMembers(freezeObject){
	var eventId = freezeObject.eventId;
	return eventsDB
			.findById(eventId)
			.then(function(event){
				event.frozeMembers.push(freezeObject);
				return event.save();
			});
}


function addExpense(eventId, expense){
	return eventsDB
				.findById(eventId)
				.then(function(event){
					event.expenses.push(expense);
					return event.save();
				});
}


function addToDiscountedMembers(ids){
	var eventId = ids.eventId;
	var userId = ids.userId;
	return eventsDB
				.findById(eventId)
				.then(function(event){
					for(var u in event.discountedMembers){
						if(event.discountedMembers[u] === userId){
							var err = 'You Already had a discount!';
							return (err);
						}else{
							event.discountedMembers.push(userId);
							return event.save();
						}
					}
				});
}


function addMemberToEvent(eventId, userId){
	return eventsDB
			.findById(eventId)
			.then(function(event){
				event.registeredMembers.push(userId);
				return event.save();
			});
}


function findEventByEventId(eventId){
	return eventsDB
				.findById(eventId)
				.populate('registeredMembers')
				.exec();
}

function findEventsByMakerId(makerId){
	return eventsDB
				.find({makerId: makerId})
				.sort('startingDate')
				.populate('registeredMembers')
				.exec();
}

// function createMakerEventsList(makerId){
// 	var today = (new Date()).toISOString();
// 	return eventsDB
// 				.find({
// 					makerId: makerId,
// 					startingDate: {$gt: today}
// 				})
// 				.sort('startingDate')
// 				.exec();
// }

function getAllEvents(){
	var today = (new Date()).toISOString();
	return eventsDB
				.find({
					startingDate: {$gt: today}
				})
				.sort('startingDate')
				.populate('makerId')
				.exec();
}

function addNewEvent(makerId, event){
	var eventTemp = null;
	return eventsDB
				.create(event)
				.then(function(addedEvent){
					eventTemp = addedEvent;
					return usersDB.addEventId(makerId, addedEvent._id);
				})
				.then(function(maker){
					return eventTemp;
				});
}


function updateEventByAdmin(eventId, updatedEvent){
	return eventsDB.update({_id: eventId}, {$set: updatedEvent});
}


function updateEvent(eventId, updatedEvent){
	return eventsDB.update({_id: eventId}, {$set: updatedEvent});
}

function removeEvent(makerId, eventId){
	return eventsDB
				.remove({_id: eventId})
				.then(function(status){
					return usersDB.removeEventFromList(makerId, eventId);
				})
				.then(function(removedEvent){
					return removedEvent;
				});
}