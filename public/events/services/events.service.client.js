(function() {
	angular
		.module('whatsOnJordan')
		.service('eventsService', eventsService);

	function eventsService($http) {

		function init() {}
		init();


		this.getAllEvents = getAllEvents;
		this.findEventByEventId = findEventByEventId;
		this.findEventsByMakerId = findEventsByMakerId;
		this.addNewEvent = addNewEvent;
		this.reNewEvent = reNewEvent;
		this.updateEvent = updateEvent;
		this.removeEvent = removeEvent;
		this.updateEventByAdmin = updateEventByAdmin;
		this.eventConfig = eventConfig;
		this.getMapBoxKey = getMapBoxKey;
		this.addToDiscountedMembers = addToDiscountedMembers;
		this.addExpense = addExpense;
		this.addToFrozeMembers = addToFrozeMembers;
		// this.removeFromFrozeMembers = removeFromFrozeMembers;
		this.removeFrozen = removeFrozen;
		// this.createMakerEventsList = createMakerEventsList;

		// function createMakerEventsList(makerId){
		// 	return $http.get('/api/makerEventsList/' + makerId);
		// }


		function removeFrozen(ids){
			var userId = String(ids.userId);
			var eventId = String(ids.eventId);
			var originalEventId = String(ids.originalEventId);
			return $http.put('/api/event/removeFrozen', ids);
		}

		function addToFrozeMembers(freezeObject){
			return $http.put('/api/event/addToFrozeMembers', freezeObject);
		}

		function addExpense(expense){
			return $http.put('/api/event/addExpense', expense);
		}

		function addToDiscountedMembers(ids){
			return $http.put('/api/event/addToDiscountedMembers', ids);
		}

		function getMapBoxKey(){
			return $http.get('/api/getMapBoxKey');
		}

		function eventConfig(){
			return $http.get('/api/eventConfig');
		}

		function updateEventByAdmin(event){
			return $http.put('/api/admin/updateEventByAdmin/'+event.id, event)
				.then(function(response){
					return response.data;
				});
		}


		function getAllEvents(){
			return $http.get('/api/allEvents')
				.then(function(response){
					return response.data;
				});
		}

		function findEventByEventId(eventId){
			return $http.get('/api/event/' + eventId)
				.then(function(response){
					return response.data;
				});
		}

		function findEventsByMakerId(makerId) {
			return $http.get('/api/makerEvents/' + makerId)
				// .then(function(response){
					
				// 	return response.data;
				// });
		}

		function addNewEvent(newEvent){
			return $http.post('/api/event/newEvent', newEvent);
				// .then(function(response){
				// 	return response.data;
				// });
			// events.push(newEvent);
		}

		function reNewEvent(reNewedEvent){
			return $http.post('/api/event/reNewEvent', reNewedEvent);
		}

		function updateEvent(updatedEvent, eventId){
			return $http.put('/api/updateEvent/?eventId='+eventId, updatedEvent);
				// .then(function (response){
				// 	return response.data;					
				// });			
		}


		function removeEvent(makerId, eventId){
			var url = '/api/event/?eventId=' + eventId + '&makerId='+makerId;
			return $http.delete(url)
				.then(function(response){
					return response.data;
				});
			// for(var e in events){
			// 	if (events[e].eventId === eventId){
			// 		events.splice(e,1);
			// 		return events;
			// 	}
			// }
		}




	}
})();