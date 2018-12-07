(function () {
	angular
		.module('whatsOnJordan')
		.controller('makerEditEventController', makerEditEventController);

	function makerEditEventController(eventsService, $location, loggedMaker, userService){
		var model = this;

		function init(){
			model.updateEventMain = true;
			model.loggedMaker = loggedMaker;
			eventsService
				.findEventsByMakerId(loggedMaker._id)
				.then(function(events){
					model.eventsList = events;
				});
			model.selectedEvent = null;

			// userService
			// 		.checkUserLogin()
			// 		.then(function(result){
			// 			if(result){
			// 				model.loggedUser = result;
			// 			}
			// 		});
		}
		init();

		model.updateEvent = updateEvent;
		model.selectEvent = selectEvent;
		model.logout = logout;
		model.updateMainEventDetails = updateMainEventDetails;
		model.cancelUpdate = cancelUpdate;


		function updateMainEventDetails(updatedEvent, daysOfWeek){

			// create dates based on start-end dates and the days of the weeks
			var start = new Date(updatedEvent.startingDate);
			var end = new Date(updatedEvent.expiryDate);
			var days = [];
			var eventDays = [];
			for(var i in daysOfWeek){
				if(daysOfWeek[i] === true){	
					switch (i) {
					    case "Sun":
					        days.push(0);
					        break;
						case "Mon":
					        days.push(1);
					        break;
						case "Tue":
					        days.push(2);
					        break;
						case "Wed":
					        days.push(3);
					        break;
						case "Thu":
					        days.push(4);
					        break;
				        case "Fri":
				     	    days.push(5);
				     	    break;
						case "Sat":
					        days.push(6);
					        break;
					}
				}
			}
			
			// Store the selected days per week
			updatedEvent.daysPerWeek = days;

			// Create the event days for the period of the event.
			for (start; end >= start; start.setDate(start.getDate()+1)){
				inner:
				for(var j in days){
					if(start.getDay() === days[j]){
						eventDays.push(start.toDateString());
						break inner;
					}	
				}
			}

			if(updatedEvent.eventDays.length === 0){
				updatedEvent.eventDays = eventDays;
			}
			
			// When update: check if the days per week is changed
			for(var e in model.selectedEvent.eventDays){
				if(model.selectedEvent.eventDays[e] !== eventDays[e]){
					// If the days chaned then store the new days per week
					updatedEvent.eventDays = eventDays;
					
					// temporary store the old details for each day in array
					var detailsArray = [];
					for(var n in updatedEvent.programDailyDetails){
						detailsArray.push(updatedEvent.programDailyDetails[n]);
					}

					// remove the old details for old days
					for(var h in updatedEvent.programDailyDetails){
						delete updatedEvent.programDailyDetails[h];
					}
					
					// store the daily details in the new dates
					for(var d in updatedEvent.eventDays){
						updatedEvent.programDailyDetails[updatedEvent.eventDays[d]] = detailsArray[d];
					}
					break;
				}
			}

			
			// switch to the next form 
			model.updateEventMain = false;
			model.updateEventProgramDetails = true;
		}


		function updateEvent(updatedEvent){
			var eventId = model.selectedEvent._id;
			eventsService
				.updateEvent(updatedEvent, eventId)
				.then(function(finalEvent){
					var url = "/makerProfile";
					$location.url(url);
				});
		}

		function selectEvent(eventId){
			eventsService
				.findEventByEventId(eventId)
				.then(function(event){
					event.startingDate = new Date(event.startingDate);
					event.expiryDate = new Date(event.expiryDate);
					event.sessionStartTime = new Date (event.sessionStartTime);
					event.sessionEndTime = new Date (event.sessionEndTime);
					
					model.selectedEvent = event;

					// Reverse the selected days
					// 0: Sun   1: Mon   2: Tue   3: Wed    4: Thu  5: Fri  6: Sat 			
					var daysOfWeek = {Sun:false, Mon:false, Tue:false, Wed:false, Thu:false, Fri:false, Sat:false};
					for(var i in model.selectedEvent.daysPerWeek){
						switch (model.selectedEvent.daysPerWeek[i]) {
							case 0:
								daysOfWeek.Sun = true;
								break;
							case 1:
								daysOfWeek.Mon = true;
								break;
							case 2:
								daysOfWeek.Tue = true;
								break;
							case 3:
								daysOfWeek.Wed = true;
								break;
							case 4:
								daysOfWeek.Thu = true;
								break;
							case 5:
								daysOfWeek.Fri = true;
								break;
							case 6:
								daysOfWeek.Sat = true;
								break;
						}
					}
					model.daysOfWeek = daysOfWeek;
					console.log(model.selectedEvent.daysPerWeek)
				});
		}


		function cancelUpdate(){
			var url = "/makerProfile";
			$location.url(url);
		}


		function logout(){
			userService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}

	}
})();