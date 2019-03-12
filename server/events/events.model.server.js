// var mongoose = require('mongoose');
// var eventsSchema = require('./events.schema.server.js');
var db = require('../databse');
var Op = db.Sequelize.Op;

var eventsDB = require('../models/event.model');
var addressesDB = require('../AllUsers/addresses.model.server');
var geoLocationsDB = require('../AllUsers/geoLocation.model.server');
var Address = require('../models/address.model');
db.sync();

// var usersDB = require('../AllUsers/users.model.server.js');

// var eventsDB = mongoose.model('eventsDB', eventsSchema);

module.exports = eventsDB;

eventsDB.addNewEvent = addNewEvent;
eventsDB.reNewEvent = reNewEvent;
eventsDB.getAllEvents = getAllEvents;
eventsDB.findEventByEventId = findEventByEventId;
eventsDB.findEventsByMakerId = findEventsByMakerId;
eventsDB.getMakerAddresses = getMakerAddresses;
eventsDB.updateEvent = updateEvent;
eventsDB.updateEventByAdmin = updateEventByAdmin;
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
	console.log('makerId: ', makerId);
	// console.log('event details: ', event);
	event.main.categoryId = event.category.categoryId;
	event.main.subCategoryId = event.category.subCategoryId;
	event.main.ageGroupId = event.age.ageGroup.id;
	event.main.addressId = event.address.id;
	event.main.geoLocationId = event.geoLocation.id;
	event.main.makerId = makerId;
	
	return eventsDB
		.create(event.main)
		.then(function (addedEvent) {
			// send the address to addressesDB to create address there and then set the id on the event
			// if the maker add new address the address
			if(event.newAddressAdded){
				return addressesDB
						.createAddress(event.address)
						.then(function(addedAddress){
							// var addressId = addedAddress.id;
							addedEvent.addressId = addedAddress.id;
							// addedEvent.categoryId = categoryId;
							// addedEvent.subCategoryId = subCategoryId;
							// addedEvent.ageGroupId = ageGroupId;
							return addedEvent.save();
						})
			}
		})
		.then(function(addedEvent){
			if(event.newGeoLocationAdded){
				return geoLocationsDB
					.addEventLocation(event.geoLocation)
						.then(function(addedLocation){
							addedEvent.geoLocationId = addedLocation.id;
							return addedEvent.save();
						})

			}
		})
		// .then(function (maker) {
		// 	return eventTemp;
		// });
}

function reNewEvent(reNewedEvent){
	reNewedEvent.daysPerWeek = JSON.stringify(reNewedEvent.daysPerWeek);
	reNewedEvent.dailyDetails = JSON.stringify(reNewedEvent.dailyDetails);
	reNewedEvent.images = JSON.stringify(reNewedEvent.images);

	// reNewedEvent.categoryId = reNewedEvent.category.id;
	// reNewedEvent.subCategoryId = reNewedEvent.subCategory.id;
	reNewedEvent.ageGroupId = reNewedEvent.ageGroup.id;
	reNewedEvent.addressId = reNewedEvent.address.id;

	return eventsDB
		.create(reNewedEvent)
		.then(function(addedEvent){
			// if the maker add new address the address he must change the geolocation also
			if (reNewedEvent.newAddressAdded){
				// prepare address and geoLocation object
				var removedKeys = ['id', 'createdAt', 'updatedAt']
				for(var a in removedKeys){
					delete(reNewedEvent.address[removedKeys[a]]);
				}
				var newAddress = reNewedEvent.address;
				return addressesDB
					.createAddress(newAddress)
					.then(function (addedAddress) {
						addedEvent.addressId = addedAddress.id;
						return addedEvent.save();
					});
				}else{
					return addedEvent;
				}
			})
			.then(function(addedEvent){
				if (reNewedEvent.newGeoLocationAdded) {
					// prepare address and geoLocation object
					var removedKeys = ['id', 'createdAt', 'updatedAt']
					for (var a in removedKeys) {
						delete (reNewedEvent.geoLocation[removedKeys[a]]);
					}
					var newGeoLocation = reNewedEvent.geoLocation;
					return geoLocationsDB
						.addEventLocation(newGeoLocation)
						.then(function (addedLocation) {
							addedEvent.geoLocationId = addedLocation.id;
							return addedEvent.save();
						});
				}else{
					return addedEvent;
				}
			})
}

function getAllEvents() {
	var today = (new Date()).toISOString();
	return eventsDB
		.findAll({
			where: {startingDate: {$gte: today}},
			include: [{ all: true }]
		})
		// .sort('startingDate')
		// .populate('makerId')
		// .exec();
}




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


function findEventByEventId(eventId){
	return eventsDB
				.find({
					where: {id: eventId},
					attributes: {exclude: ['createdAt', 'updatedAt', 'appropved', 'special']},
					include: [{all:true}]
					});
}

function findEventsByMakerId(makerId){
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

function getMakerAddresses(makerId){
	return eventsDB
			.findAll({
				where: {makerId: makerId},
				attributes: [],
				include: [{model: Address}]
			});
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


function updateEventByAdmin(eventId, updatedEvent){
	return eventsDB.update(updatedEvent, {where: {id: eventId}});
}


function updateEvent(eventId, updatedEvent){
	// console.log('event id: ', eventId);
	console.log('updated event: ', updatedEvent);	
	updatedEvent.daysPerWeek = JSON.stringify(updatedEvent.daysPerWeek);
	updatedEvent.dailyDetails = JSON.stringify(updatedEvent.dailyDetails);
	updatedEvent.images = JSON.stringify(updatedEvent.images);

	// updatedEvent.categoryId = updatedEvent.category.id;
	// updatedEvent.subCategoryId = updatedEvent.subCategory.id;
	updatedEvent.ageGroupId = updatedEvent.ageGroup.id;
	updatedEvent.addressId = updatedEvent.address.id;
	updatedEvent.geoLocationId = updatedEvent.geoLocation.id;

	return eventsDB
		.findById(eventId)
		.then(function (foundEvent) {
			// if the maker add new address the address he must change the geolocation also
			if(updatedEvent.newAddressAdded){
				// prepare address and geoLocation object
				var removedKeys = ['id', 'createdAt', 'updatedAt']
				for (var a in removedKeys) {
					delete (updatedEvent.address[removedKeys[a]]);
				}
				var newAddress = updatedEvent.address;

				return addressesDB
					.createAddress(newAddress)
					.then(function (addedAddress) {
						updatedEvent.addressId = addedAddress.id;
						return foundEvent;
					});
			}else{
				return foundEvent;
			}
		})
		.then(function (foundEvent) {
			if (updatedEvent.newGeoLocationAdded){
				// prepare address and geoLocation object
				var removedKeys = ['id', 'createdAt', 'updatedAt']
				for (var a in removedKeys) {
					delete (updatedEvent.geoLocation[removedKeys[a]]);
				}
				var newGeoLocation = updatedEvent.geoLocation;
				return geoLocationsDB
					.addEventLocation(newGeoLocation)
					.then(function (addedLocation) {
						updatedEvent.geoLocationId = addedLocation.id;
						return foundEvent;
					});
			}else{
				return foundEvent;
			}
		})
		.then(function (foundEvent){
			return foundEvent.update(updatedEvent);
		})
}




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