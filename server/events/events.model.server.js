// var mongoose = require('mongoose');
// var eventsSchema = require('./events.schema.server.js');
var db = require('../databse');
var eventsDB = require('../models/event.model');
var addressDB = require('../AllUsers/addresses.model.server');
db.sync();

// var usersDB = require('../AllUsers/users.model.server.js');

// var eventsDB = mongoose.model('eventsDB', eventsSchema);

module.exports = eventsDB;

eventsDB.addNewEvent = addNewEvent;
// eventsDB.getAllEvents = getAllEvents;
// eventsDB.findEventByEventId = findEventByEventId;
eventsDB.findEventsByMakerId = findEventsByMakerId;
// eventsDB.updateEvent = updateEvent;
// eventsDB.removeEvent = removeEvent;
// eventsDB.updateEventByAdmin = updateEventByAdmin;
// eventsDB.addMemberToEvent = addMemberToEvent;
// eventsDB.addToDiscountedMembers = addToDiscountedMembers;
// eventsDB.addExpense = addExpense;
// eventsDB.addToFrozeMembers = addToFrozeMembers;
// eventsDB.removeFrozen = removeFrozen;
// eventsDB.createMakerEventsList = createMakerEventsList;




/* 
on event creation: 
event details:  { name: 'Event 1',
  category: 'Category 1',
  subcategory: 'sub category 1',
  ageGroup: { ageGroupTitle: 'Junior', ageGroupFrom: 4, ageGroupTo: 6 },
  details: 'Details',
  startingDate: '2019-02-28T22:00:00.000Z',
  expiryDate: '2019-03-31T21:00:00.000Z',
  sessionStartTime: '1970-01-01T14:00:00.000Z',
  sessionEndTime: '1970-01-01T16:00:00.000Z',
  price: '200',
  address: 'Amman',
  termsAndConditions: 'Terms and conditions 1',
  daysPerWeek: [ 6, 1, 3 ],
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

function addNewEvent(makerId, event) {
	// var eventTemp = null;
	console.log('on the addNewEvent on model');
	console.log('makerId: ', makerId);
	console.log('event details: ', event);
	var categoryId = event.categoryId;
	var subCategoryId = event.subCategoryId;
	var ageGroupId = event.ageGroup.id;
	var address = event.address;
	var eventDetails ={
		name: event.name,
		category: event.category,
		subcategory: event.subcategory,
		ageGroup: event.ageGroup,
		details: event.details,
		startingDate: event.startingDate,
		expiryDate: event.expiryDate,
		sessionStartTime: (new Date(event.sessionStartTime)),
		sessionEndTime: (new Date(event.sessionEndTime)),
		price: event.price,
		address: event.address,
		termsAndConditions: event.termsAndConditions,
		daysPerWeek: JSON.stringify(event.daysPerWeek)
	}
	return eventsDB
		.create(eventDetails)
		.then(function (addedEvent) {
			// eventTemp = addedEvent;
			// return usersDB.addEventId(makerId, addedEvent._id);
			
			// send the address to addressDB to create address there and then set the id on the event
			if(event.address){
				return addressDB
						.createAddress(address)
						.then(function(addedAddress){
							var addressId = addedAddress.id;
							addedEvent.addressId = addressId;
							addedEvent.makerId = makerId;
							addedEvent.categoryId = categoryId;
							addedEvent.subCategoryId = subCategoryId;
							addedEvent.ageGroupId = ageGroupId;
							return addedEvent.save();
						})
			}

		})
		// .then(function (maker) {
		// 	return eventTemp;
		// });
}

// function getAllEvents() {
// 	var today = (new Date()).toISOString();
// 	return eventsDB
// 		.find({
// 			startingDate: { $gt: today }
// 		})
// 		.sort('startingDate')
// 		.populate('makerId')
// 		.exec();
// }




// function removeFrozen(ids){
// 	// console.log(ids);
// 	var eventId = ids.eventId;
// 	var userId = ids.userId;
// 	var originalEventId = ids.originalEventId;
// 	return eventsDB
// 				.findById(eventId)
// 				.then(function(event){
// 					console.log('the found event is:');
// 					console.log(event);
// 					for(var f in event.frozeMembers){
// 						if(event.frozeMembers[f].userId === userId){
// 							// instead of remove the frozen members set the compensated to true
// 							// event.frozeMembers.splice(f,1);
// 							event.frozeMembers[f].compensated = true;
// 							console.log('compensated after is: ',event.frozeMembers[f].compensated);
// 						}
// 					}
// 					return event.save();
// 					// return usersDB.findById(userId);
// 				})
// 				// .then(function(user){
// 				.then(
// 					usersDB
// 						.findById(userId)
// 						.then(function(user){
// 							console.log('the user is: ');
// 							console.log(user);
// 							for(var i in user.userEventParameters){
// 								if(user.userEventParameters[i].eventId === originalEventId){
// 									user.userEventParameters[i].freezeDays.splice(0, user.userEventParameters[i].freezeDays.length);
// 								}
// 							}
// 							return user.save();
							
// 						})

// 					);
// }




// function addToFrozeMembers(freezeObject){
// 	var eventId = freezeObject.eventId;
// 	return eventsDB
// 			.findById(eventId)
// 			.then(function(event){
// 				event.frozeMembers.push(freezeObject);
// 				return event.save();
// 			});
// }


// function addExpense(eventId, expense){
// 	return eventsDB
// 				.findById(eventId)
// 				.then(function(event){
// 					event.expenses.push(expense);
// 					return event.save();
// 				});
// }


// function addToDiscountedMembers(ids){
// 	var eventId = ids.eventId;
// 	var userId = ids.userId;
// 	return eventsDB
// 				.findById(eventId)
// 				.then(function(event){
// 					for(var u in event.discountedMembers){
// 						if(event.discountedMembers[u] === userId){
// 							var err = 'You Already had a discount!';
// 							return (err);
// 						}else{
// 							event.discountedMembers.push(userId);
// 							return event.save();
// 						}
// 					}
// 				});
// }


// function addMemberToEvent(eventId, userId){
// 	return eventsDB
// 			.findById(eventId)
// 			.then(function(event){
// 				event.registeredMembers.push(userId);
// 				return event.save();
// 			});
// }


// function findEventByEventId(eventId){
// 	return eventsDB
// 				.findById(eventId)
// 				.populate('registeredMembers')
// 				.exec();
// }

function findEventsByMakerId(makerId){
	console.log('the maker id: ', makerId);
	
	return eventsDB
				.findAll({
					where: {makerId: makerId},
					include: [{all: true}]
				});
	// return eventsDB
	// 			.find({makerId: makerId})
	// 			.sort('startingDate')
	// 			.populate('registeredMembers')
	// 			.exec();
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


// function updateEventByAdmin(eventId, updatedEvent){
// 	return eventsDB.update({_id: eventId}, {$set: updatedEvent});
// }


// function updateEvent(eventId, updatedEvent){
// 	return eventsDB.update({_id: eventId}, {$set: updatedEvent});
// }

// function removeEvent(makerId, eventId){
// 	return eventsDB
// 				.remove({_id: eventId})
// 				.then(function(status){
// 					return usersDB.removeEventFromList(makerId, eventId);
// 				})
// 				.then(function(removedEvent){
// 					return removedEvent;
// 				});
// }