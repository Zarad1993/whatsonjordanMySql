(function () {
	angular
		.module('whatsOnJordan')
		.controller('organizerEditEventController', organizerEditEventController);

	function organizerEditEventController(eventsService, addressService, getterService,  $location, loggedOrganizer, authService){
		var model = this;

		function init(){
			if(!loggedOrganizer){
				$location.url('/login');
				return;
			}

			model.organizerProfile = loggedOrganizer.chosenRole;
			model.allRoles = loggedOrganizer.allRoles;

			model.updateEventMain = true;
			// model.loggedOrganizer = loggedOrganizer;
			model.newAddressAdded = false;
			model.addressSelected = false;
			// model.newGeoLocationAdded = false;
			var organizerId = model.organizerProfile.contact.id;

			eventsService
				.findEventsByOrganizerId(model.organizerProfile.contact.id)
				.then(function(events){
					// console.log('the events',events);
					model.eventsList = events.data;
				});
			model.selectedEvent = null;

			//  bring categories, subcategories, ageGroups and addresses from the database and the map config from server.
			getterService
				.getEventHelpers(organizerId)
				.then(function (result) {
					var eventHelpers = result.data;
					console.log('the event helpers:', eventHelpers);
					for (var i in eventHelpers) {
						var key = Object.keys(eventHelpers[i])[0];
						model[key] = eventHelpers[i][Object.keys(eventHelpers[i])[0]];
					}
				})
				.then(function () {
					eventsService
						.getMapBoxKey()
						.then(function (mapBoxKey) {
							model.mapBoxKey = mapBoxKey.data;

							// MapBox Maps
							// Get the access token from the server
							mapboxgl.accessToken = model.mapBoxKey;

							$('#mapModal').on('shown.bs.modal', function () {
								// Initilise the map 
								var map = new mapboxgl.Map({
									container: 'mapForLocation',
									// style: 'mapbox://styles/mapbox/streets-v10',
									style: 'mapbox://styles/mapbox/satellite-streets-v9',
									center: [35.87741988743201, 32.003009804995955],
									// center: [model.position.currentposition.lng, model.position.currentposition.lat],
									zoom: 12
								});

								// Show map controller
								map.addControl(new mapboxgl.NavigationControl());

								// Get the location from the map
								map.on('click', function (e) {
									// var latitude = e.lngLat.lat;
									// var longitude = e.lngLat.lng;
									model.mapLocation.latitude = e.lngLat.lat;
									model.mapLocation.longitude = e.lngLat.lng;
									document.getElementById('mapLat').innerHTML = model.mapLocation.latitude;
									document.getElementById('mapLng').innerHTML = model.mapLocation.longitude;
								});

							});
						});
				});
		}
		init();

		model.updateEvent = updateEvent;
		model.selectEvent = selectEvent;
		
		model.getCurrentLocation = getCurrentLocation;
		model.getLocationFromMap = getLocationFromMap;
		model.mapLocation = {longitude: 0, latitude: 0};

		model.logout = logout;
		model.updateMainEventDetails = updateMainEventDetails;
		model.addNewAddress = addNewAddress;
		model.cancelUpdate = cancelUpdate;
		model.selectAddress = selectAddress;

		
		function selectAddress() {
			model.addressSelected = true;
			model.newAddressAdded = false;
		}

		function getCurrentLocation() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition);
				// model.newGeoLocationAdded = true;
			} else {
				console.log("Geolocation is not supported by this browser.");
			}
		}

		function showPosition(position) {
			model.mapLocation.latitude = position.coords.latitude;
			model.mapLocation.longitude = position.coords.longitude;
			document.getElementById('mapLongitude').value = model.mapLocation.longitude;
			document.getElementById('mapLatitude').value = model.mapLocation.latitude;
		}

		function getLocationFromMap() {
			document.getElementById('mapLongitude').value = model.mapLocation.longitude;
			document.getElementById('mapLatitude').value = model.mapLocation.latitude;
			// model.newGeoLocationAdded = true;
		}



		function updateMainEventDetails(updatedEvent, daysOfWeek, mapLocation){
			console.log('the map location: ', mapLocation);
			
			// console.log('the updated event is:', updatedEvent);
			// updatedEvent.mapLocation = mapLocation;
			if(model.newAddressAdded){
				updatedEvent.geoLocation = mapLocation;
				// updatedEvent.geoLocation.longitude = mapLocation.longitude;
			}
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
			// console.log('the calculated event days', eventDays);
			
			// if(updatedEvent.eventDays.length === 0){
			// 	updatedEvent.eventDays = eventDays;
			// }

			// if (!updatedEvent.eventDays || updatedEvent.eventDays.length === 0) {
				model.eventDays = eventDays;
			// }
			
			// When update: check if the days per week is changed
			// for(var e in model.selectedEvent.eventDays){
				// if(model.selectedEvent.eventDays[e] !== eventDays[e]){
					// If the days changed then store the new days per week
					updatedEvent.eventDays = eventDays;
					
					if (updatedEvent.dailyDetails){
						// temporary store the old details for each day in array
						var detailsArray = [];
						for(var n in updatedEvent.dailyDetails.programDailyDetails){
							detailsArray.push(updatedEvent.dailyDetails.programDailyDetails[n]);
						}
	
						// remove the old details for old days
						for(var h in updatedEvent.dailyDetails.programDailyDetails){
							delete updatedEvent.dailyDetails.programDailyDetails[h];
						}
						
						// store the daily details in the new dates
						for(var d in updatedEvent.eventDays){
							updatedEvent.dailyDetails.programDailyDetails[updatedEvent.eventDays[d]] = detailsArray[d];
						}

					}
					// break;
				// }
			// }

			
			// switch to the next form 
			model.updateEventMain = false;
			model.updateEventProgramDetails = true;
		}
		
		
		function updateEvent(updatedEvent){
			var eventId = model.selectedEvent.id;
			updatedEvent.newAddressAdded = model.newAddressAdded;
			updatedEvent.addressSelected = model.addressSelected;
			// updatedEvent.newGeoLocationAdded = model.newGeoLocationAdded;
			console.log('the final updated event to go:', updatedEvent);
			eventsService
				.updateEvent(updatedEvent, eventId)
				.then(function(finalEvent){
					console.log('the final result after update the event: ', finalEvent.data);
					var url = "/organizerProfile/eventsList";
					$location.url(url);
				});
		}

		function selectEvent(eventId){
			eventsService
				.findEventByEventId(eventId)
				.then(function(event){
					console.log('the selected event', event);
					model.mapLocation = { longitude: event.address.geoLocation.longitude, latitude: event.address.geoLocation.latitude };
					event.startingDate = new Date(event.startingDate);
					event.expiryDate = new Date(event.expiryDate);
					// event.sessionStartTime = event.startingDate.getTime();
					event.sessionStartTime = new Date(event.sessionStartTime);
					event.sessionEndTime = new Date (event.sessionEndTime);
					
					// event.daysPerWeek = JSON.parse(event.daysPerWeek);
					// event.dailyDetails = JSON.parse(event.dailyDetails);
					// event.images = JSON.parse(event.images);
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
				});
		}

		function addNewAddress() {
			// console.log('new address added');
			model.newAddressAdded = true;
			model.addressSelected = false;
		}


		function cancelUpdate(){
			var url = "/OrganizerProfile";
			$location.url(url);
		}


		function logout(){
			authService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}

	}
})();