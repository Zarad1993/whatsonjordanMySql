var eventsDB = require('./events.model.server.js');

module.exports = function(app) {

	

	// http handlers
	app.get('/api/allEvents', getAllEvents);
	app.get('/api/eventDetails/:makerId', findEventsByMakerId);
	// app.get('/api/event/:eventId', findEvent);
	// app.get('/api/event/', findEvent);
	app.get('/api/makerEvents/:makerId', findEventsByMakerId);
	// app.get('/api/makerEventsList/:makerId', createMakerEventsList);
	// app.get('/api/event/:eventId', findEventByEventId);
	app.post('/api/event/', addNewEvent);
	app.put('/api/event/', updateEvent);
	app.delete('/api/event/', removeEvent);
	app.put('/api/admin/updateEventByAdmin/:eventId', checkAdmin, updateEventByAdmin);
	app.get('/api/eventConfig', eventConfig);
	app.get('/api/getMapBoxKey', getMapBoxKey);
	app.put('/api/event/addToDiscountedMembers', addToDiscountedMembers);
	app.put('/api/event/addExpense', addExpense);
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

	function addExpense(req, res){
		var expense = req.body;
		var eventId = expense.eventId;
		delete(expense.eventId);
		eventsDB
			.addExpense(eventId, expense)
			.then(function(result){
				res.send(result);
			});
	}

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
				eventsParams.eventsList = events;
				res.send(eventsParams);
			});
	}


	function checkAdmin(req, res, next){
		if (req.user && req.user.userTypeId === 3){
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
				console.log('the events ares: ', events);
				res.send(events);
				return;
			});

	}

	// function findEventByEventId(req, res){
	// 	var eventId = req.params.eventId;
	// 	eventsDB
	// 		.findEventByEventId(eventId)
	// 		.then(function(event){
	// 			res.send(event);
	// 			return;
	// 		});
	// }

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
		// events.push(newEvent);
		eventsDB
			.addNewEvent(makerId, newEvent)
			.then(function(addedEvent){
				res.send(addedEvent);
				return;
			});
	}

	function updateEvent(req, res){
		var eventId = req.query.eventId;
		var updatedEvent = req.body;
		// request the admin to approve the amendments
		updatedEvent.approved = false;
		updatedEvent.special = false;
		eventsDB
			.updateEvent(eventId, updatedEvent)
			.then(function(status){
				// res.send(status);
				// return;
				eventsDB
					.findEventByEventId(eventId)
					.then(function(event){
						res.send(event);
						return;
					})
			});
		// for(var e in events){
		// 	if (events[e].eventId === eventId){
		// 		events[e].name = newEvent.name;
		// 		events[e].category = newEvent.category;
		// 		events[e].subcategory = newEvent.subcategory;
		// 		events[e].details = newEvent.details;
		// 		res.send(events[e]);
		// 		return;
		// 	}
		// }
		// res.send('error');
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