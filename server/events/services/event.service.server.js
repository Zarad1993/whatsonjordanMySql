var eventsDB = require('../events.model.server.js');


module.exports = function(app) {

	

	// http handlers
	app.get('/api/allEvents', getAllEvents);
	// app.get('/api/eventDetails/:makerId', findEventsByMakerId);
	// app.get('/api/event/:eventId', findEvent);
	// app.get('/api/event/', findEvent);
	app.get('/api/makerEvents/:makerId', findEventsByMakerId);
	// app.get('/api/makerEventsList/:makerId', createMakerEventsList);
	app.get('/api/event/:eventId', findEventByEventId);
	app.post('/api/event/newEvent', addNewEvent);
	app.post('/api/event/reNewEvent', reNewEvent);
	app.put('/api/updateEvent/', updateEvent);
	app.delete('/api/event/', removeEvent);
	app.put('/api/admin/updateEventByAdmin/:eventId', checkAdmin, updateEventByAdmin);
	app.get('/api/eventConfig', eventConfig);
	app.get('/api/getMapBoxKey', getMapBoxKey);
	app.put('/api/event/addToDiscountedMembers', addToDiscountedMembers);
	// app.put('/api/event/addExpense/:eventId', addExpense);
	app.put('/api/event/addToFrozeMembers', addToFrozeMembers);
	// app.delete('/api/event/removeFromFrozeMembers/:userId/:eventId', removeFromFrozeMembers);
	// app.put('/api/event/removeFrozen/:userId/:eventId/:originalEventId', removeFrozen);
	app.put('/api/event/removeFrozen', removeFrozen);


	// function createMakerEventsList(req, res){
	// 	var makerId = req.params.makerId;
	// 	eventsDB
	// 		.createMakerEventsList(makerId)
	// 		.then(function(result){
	// 			res.send(result);
	// 			return;
	// 		});
	// }

	function removeFrozen(req, res){
		var ids = req.body;
		console.log(ids);
		eventsDB
			.removeFrozen(ids)
			.then(function(result){
				console.log('the result of remove frozen is: ');
				console.log(result);
				res.send(result);
			});
	}


	function addToFrozeMembers(req, res){
		var freezeObject = req.body;
		eventsDB
			.addToFrozeMembers(freezeObject)
			.then(function(result){
				res.send(result);
			});
	}

	// function addExpense(req, res){
	// 	var expense = req.body;
	// 	var eventId = req.params.eventId;
	// 	// delete(expense.eventId);
	// 	// eventsDB
	// 	// 	.addExpense(eventId, expense)
	// 	// 	.then(function(result){
	// 	// 		res.send(result);
	// 	// 	});
	// }

	function addToDiscountedMembers(req, res){
		var ids = req.body;
		eventsDB
			.addToDiscountedMembers(ids)
			.then(function(result){
				res.send(result);
			});
	}


	function getMapBoxKey(req, res){
		var mapBoxKey = process.env.mapboxAccessToken;
		res.send(mapBoxKey);
	}
	

	function eventConfig(req, res){
		var eventsParams = {};
		eventsParams.mapBoxKey = process.env.mapboxAccessToken;

		eventsDB
			.getAllEvents()
			.then(function(events){
				eventsParams.eventsList = events.filter(function (event) {
				event.images = JSON.parse(event.images);
				event.daysPerWeek = JSON.parse(event.daysPerWeek);
				event.dailyDetails = JSON.parse(event.dailyDetails);
				return event.approved == true;});
				res.send(eventsParams);
			});
	}


	function checkAdmin(req, res, next){
		if (req.user && req.user.roleId === 3){
			next();
		}else{
			res.sendStatus(401);
		}
	}


	function updateEventByAdmin(req, res){
		var eventId = req.params.eventId;
		var updatedEvent = req.body;
		eventsDB
			.updateEventByAdmin(eventId, updatedEvent)
			.then(function(status){
				res.send(status);
				return;
			});
	}

	// function findEvent(req, res){
	// 	if(req.query.eventId){
	// 		res.send(eventsDB
	// 					.findEventByEventId(req.query.eventId)
	// 					.then(function(event){
	// 						res.send(event);
	// 						return;
	// 					})
	// 				);
	// 	}
	// 	if(req.query.makerId){
	// 		res.send(eventsDB
	// 					.findEventsByMakerId(req.query.makerId)
	// 					.then(function(event){
	// 						res.send(event);
	// 						return;
	// 					})
	// 				);
	// 		return;
	// 	}
		
	// }
	
	function findEventsByMakerId(req, res){
		var makerId = req.params.makerId;
		eventsDB
			.findEventsByMakerId(makerId)
			.then(function(events){
				res.send(events);
				return;
			});

	}

	function findEventByEventId(req, res){
		var eventId = req.params.eventId;
		eventsDB
			.findEventByEventId(eventId)
			.then(function(event){
				event.daysPerWeek = JSON.parse(event.daysPerWeek);
				event.dailyDetails = JSON.parse(event.dailyDetails);
				event.images = JSON.parse(event.images);
				
				// console.log('the found event by id is:', event);
				res.send(event);
				return;
			});
	}


	function getAllEvents(req, res){
		eventsDB
			.getAllEvents()
			.then(function(result){
				res.send(result);
				return;
			});
	}

	// function findEventByEventId(eventId){
	// 	eventsDB
	// 		.findEventByEventId(eventId)
	// 		.then(function(foundEvent){
	// 			return foundEvent;
	// 		});
		// for(var e in events){
		// 	if(eventId === events[e].eventId){
		// 		return(events[e]);
		// 	}
		// }
		// return ('error');
	// }

	// function findEventsByMakerId(makerId){
	// 	var eventsList = [];
	// 		for(var e in events){
	// 			if(makerId === events[e].makerId){
	// 				eventsList.push(events[e]);
	// 			}
	// 		}
	// 		return (eventsList);
	// }

	function addNewEvent(req, res){
		var newEvent = req.body;
		var makerId = newEvent.makerId;
		newEvent.main.daysPerWeek = JSON.stringify(newEvent.main.daysPerWeek);
		newEvent.main.dailyDetails = JSON.stringify(newEvent.main.dailyDetails);
		newEvent.main.images = JSON.stringify(newEvent.main.images);
		newEvent.main.categoryId = newEvent.category.categoryId;
		newEvent.main.subCategoryId = newEvent.category.subCategoryId;
		newEvent.main.ageGroupId = newEvent.age.ageGroup.id;
		newEvent.main.makerId = makerId;
		
		if (newEvent.addressSelected){
			newEvent.main.addressId = newEvent.address.id;
			delete(newEvent.geoLocation);
			delete(newEvent.address);
		} else if (newEvent.newAddressAdded){
			newEvent.addressId = null;
			newEvent.geoLocation.latitude = JSON.stringify(newEvent.geoLocation.latitude);
			newEvent.geoLocation.longitude = JSON.stringify(newEvent.geoLocation.longitude);
		}
		// console.log('the event to create is: ', newEvent);
		eventsDB
			.addNewEvent(makerId, newEvent)
			.then(function(addedEvent){
				console.log('the created event is: ', addedEvent);				
				res.send(addedEvent);
				return;
			});
	}

	function reNewEvent(req, res){
		var reNewedEvent = req.body;
		// console.log('the received renewed event', reNewedEvent);
		reNewedEvent.approved = false;
		reNewedEvent.special = false;

		reNewedEvent.daysPerWeek = JSON.stringify(reNewedEvent.daysPerWeek);
		reNewedEvent.dailyDetails = JSON.stringify(reNewedEvent.dailyDetails);
		reNewedEvent.images = JSON.stringify(reNewedEvent.images);
		reNewedEvent.ageGroupId = reNewedEvent.ageGroup.id;

		if (reNewedEvent.addressSelected){
			reNewedEvent.addressId = reNewedEvent.address.id;
			delete (reNewedEvent.address);
		} else if (reNewedEvent.newAddressAdded){
			reNewedEvent.addressId = null;
			reNewedEvent.geoLocation.latitude = JSON.stringify(reNewedEvent.geoLocation.latitude);
			reNewedEvent.geoLocation.longitude = JSON.stringify(reNewedEvent.geoLocation.longitude);
			// Prepare the address object
			var removedKeys = ['id', 'createdAt', 'updatedAt', 'geoLocationId', 'geoLocation'];
			for (var a in removedKeys) {
				delete (reNewedEvent.address[removedKeys[a]]);
			}
		}

		eventsDB
			.reNewEvent(reNewedEvent)
			.then(function(result){
				console.log('the result after renew event: ', result);
				res.send(result);
				
			});
	}


	function updateEvent(req, res){
		var eventId = req.query.eventId;
		var updatedEvent = req.body;
		// request the admin to approve the amendments
		updatedEvent.approved = false;
		updatedEvent.special = false;

		updatedEvent.daysPerWeek = JSON.stringify(updatedEvent.daysPerWeek);
		updatedEvent.dailyDetails = JSON.stringify(updatedEvent.dailyDetails);
		updatedEvent.images = JSON.stringify(updatedEvent.images);
		updatedEvent.ageGroupId = updatedEvent.ageGroup.id;
		
		if (updatedEvent.addressSelected) {
			updatedEvent.addressId = updatedEvent.address.id;
			// delete (updatedEvent.geoLocation);
			delete (updatedEvent.address);
		} else if (updatedEvent.newAddressAdded) {
			updatedEvent.addressId = null;
			updatedEvent.geoLocation.latitude = JSON.stringify(updatedEvent.geoLocation.latitude);
			updatedEvent.geoLocation.longitude = JSON.stringify(updatedEvent.geoLocation.longitude);
			// Prepare the address object
			var removedKeys = ['id', 'createdAt', 'updatedAt', 'geoLocationId', 'geoLocation'];
			for (var a in removedKeys) {
				delete (updatedEvent.address[removedKeys[a]]);
			}
		}

		// console.log('the event id: ', eventId);
		// console.log('the event to update on server', updatedEvent);		
		eventsDB
			.updateEvent(eventId, updatedEvent)
			.then(function(result){
				// console.log('the result after update event on DB', result);
				res.send(result);
			});
	}

	function removeEvent(req, res){
		var makerId = req.query.makerId;
		var eventId = req.query.eventId;

		eventsDB
			.removeEvent(makerId, eventId)
			.then(function(status){
				res.send(status);
				return;
			});
		// for(var e in events){
		// 	if(eventId === events[e].eventId){
		// 		events.splice(e, 1);
		// 		res.send('event deleted');
		// 		return;
		// 	}
		// }
	}




};