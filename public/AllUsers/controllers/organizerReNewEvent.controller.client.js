(function(){
	angular
		.module('whatsOnJordan')
		.controller('organizerReNewEventController', organizerReNewEventController);

	function organizerReNewEventController($location, $routeParams, eventsService, addressService, getterService, loggedOrganizer, authService){
			var model = this;
			function init(){
				var eventId = $routeParams.eventId;

				if(!loggedOrganizer){
					$location.url('/login');
					return;
				}

				model.organizerProfile = loggedOrganizer.chosenRole;
				model.allRoles = loggedOrganizer.allRoles;
				var organizerId = model.organizerProfile.contact.id;

				model.newAddressAdded = false;
				model.addressSelected = false;
				// model.newGeoLocationAdded = false;

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
					
					eventsService
					.findEventByEventId(eventId)
					.then(function(eventDetails){
						console.log('the event details: ', eventDetails);
						// model.eventDetails = eventDetails;
						model.mapLocation = { longitude: eventDetails.address.geoLocation.longitude, latitude: eventDetails.address.geoLocation.latitude };
						eventDetails.startingDate = new Date(eventDetails.startingDate);
						eventDetails.expiryDate = new Date(eventDetails.expiryDate);
						for(var s in eventDetails.daysPerWeek){
							// console.log('todays is: ', eventDetails.daysPerWeek[s]);
							eventDetails.daysPerWeek[s].from = new Date(eventDetails.daysPerWeek[s].from);
							eventDetails.daysPerWeek[s].to = new Date(eventDetails.daysPerWeek[s].to);
						}
						// event.sessionStartTime = event.startingDate.getTime();
						// eventDetails.sessionStartTime = new Date(eventDetails.sessionStartTime);
						// eventDetails.sessionEndTime = new Date(eventDetails.sessionEndTime);
						
						// eventDetails.daysPerWeek = JSON.parse(eventDetails.daysPerWeek);
						// eventDetails.dailyDetails = JSON.parse(eventDetails.dailyDetails);
						// eventDetails.images = JSON.parse(eventDetails.images);
						
						// var oldEvent = eventDetails;
						var originalEventId = eventDetails.id;
						// var unnecessaryProperties = ['created', 'eventDays', 'registeredMembers', 'discountedMembers', 'expenses', 'id', 'startingDate', 'expiryDate', 'organizerId', 'special', '__v', 'approved', 'programDailyDetails'];
						var unnecessaryProperties = ['members', 'id', 'special', 'approved'];
						for(var c in unnecessaryProperties){
							// console.log(oldEvent[unnecessaryProperties[i]]);
							delete(eventDetails[unnecessaryProperties[c]]);
						}
						model.newEvent = eventDetails;
						model.newEvent.originalEventId = originalEventId;
						// Reverse the selected days
						// 0: Sun   1: Mon   2: Tue   3: Wed    4: Thu  5: Fri  6: Sat 			
						var daysOfWeek = { Sun: false, Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false };
						for (var i in model.newEvent.daysPerWeek) {
							switch (model.newEvent.daysPerWeek[i]) {
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
						// console.log(model.newEvent);
						// console.log('the event details to renew: ', model.newEvent);
						model.eventDetailsMain = true;
					});
					
				}
				
			init();


			model.reNewEvent = reNewEvent;
			model.logout = logout;
			model.cancelRenew = cancelRenew;
			model.createEventDetails = createEventDetails;
			model.addNewAddress = addNewAddress;
			model.selectAddress = selectAddress;
			model.getLocationFromMap = getLocationFromMap;
			model.getCurrentLocation = getCurrentLocation;
			model.mapLocation = {longitude: 0, latitude: 0};
			model.eventDays = []; // will hold the event days with details
			model.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // to create the daysOfWeek
			model.daysOfWeek = {}; // will hold the days per week plus each day session time


			function selectAddress(){
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

			function showPosition(position){
				model.mapLocation.latitude = position.coords.latitude; 
				model.mapLocation.longitude = position.coords.longitude;
				document.getElementById('mapLongitude').value = model.mapLocation.longitude;
				document.getElementById('mapLatitude').value = model.mapLocation.latitude;
			}

			function getLocationFromMap(){
				document.getElementById('mapLongitude').value = model.mapLocation.longitude;
				document.getElementById('mapLatitude').value = model.mapLocation.latitude;
				// model.newGeoLocationAdded = true;
			}

			function createEventDetails(reNewed, mapLocation){
				console.log('the event to renew', reNewed);
				
				reNewed.geoLocation = mapLocation;
				// reNewed.geoLocation.longitude = mapLocation.longitude;
				// create dates based on start-end dates and the days of the weeks
				var start = new Date(reNewed.startingDate);
				var end = new Date(reNewed.expiryDate);
				// var days = [];
				// var eventDays = [];
				// for(var i in daysOfWeek){
				// 	if(daysOfWeek[i] === true){	
				// 		switch (i) {
				// 		    case "Sun":
				// 		        days.push(0);
				// 		        break;
				// 			case "Mon":
				// 		        days.push(1);
				// 		        break;
				// 			case "Tue":
				// 		        days.push(2);
				// 		        break;
				// 			case "Wed":
				// 		        days.push(3);
				// 		        break;
				// 			case "Thu":
				// 		        days.push(4);
				// 		        break;
				// 	        case "Fri":
				// 	     	    days.push(5);
				// 	     	    break;
				// 			case "Sat":
				// 		        days.push(6);
				// 		        break;
				// 		}
				// 	}
				// }
				// reNewed.daysPerWeek = days;
				
				// for (start; end>start; start.setDate(start.getDate()+1)){
				// 	inner:
				// 	for(var j in days){
				// 		if(start.getDay() === days[j]){
				// 			eventDays.push(start.toDateString());
				// 			break inner;
				// 		}
				// 	}
				// }
				// reNewed.eventDays = eventDays;

				// filter the days per week
				for (var e in reNewed.daysPerWeek) {
					if (reNewed.daysPerWeek[e].day == true) {
						reNewed.daysPerWeek[e].from = new Date(reNewed.daysPerWeek[e].from);
						reNewed.daysPerWeek[e].to = new Date(reNewed.daysPerWeek[e].to);
					} else {
						delete (reNewed.daysPerWeek[e]);
					}
				}

				// Create the event days for the period of the event.
				for (start; end >= start; start.setDate(start.getDate() + 1)) {
					inner:
					for (var j in reNewed.daysPerWeek) {
						if (start.getDay() === Number(j) && reNewed.daysPerWeek[j].day == true) {
							model.eventDays.push({ date: start.toDateString(), time: { from: reNewed.daysPerWeek[j].from, to: reNewed.daysPerWeek[j].to } });
							break inner;
						}
					}
				}
				reNewed.eventDays = model.eventDays;

				if(reNewed.programDetails){
					// temporary store the old details for each day in array
					var detailsArray = [];
					for (var n in reNewed.programDetails) {
						detailsArray.push(
							{
								title: reNewed.programDetails[n].title,
								details: reNewed.programDetails[n].details,
								videoLink: reNewed.programDetails[n].videoLink
							}
						);
					}

					// store the daily details in the new dates
					reNewed.programDetails = [];
					for (var d in reNewed.eventDays) {
						if (detailsArray[d]) {
							reNewed.programDetails.push({
								date: reNewed.eventDays[d].date,
								sessionStartTime: reNewed.eventDays[d].time.from,
								sessionEndTime: reNewed.eventDays[d].time.to,
								eventId: null,
								title: detailsArray[d].title,
								details: detailsArray[d].details,
								videoLink: detailsArray[d].videoLink
							});
						} else {
							reNewed.programDetails.push({
								date: reNewed.eventDays[d].date,
								sessionStartTime: reNewed.eventDays[d].time.from,
								sessionEndTime: reNewed.eventDays[d].time.to,
								eventId: null,
								title: '',
								details: '',
								videoLink: ''
							});
						}
					}
				}else{
					for (var u in reNewed.eventDays) {
						reNewed.programDetails.push({
							date: reNewed.eventDays[u].date,
							sessionStartTime: reNewed.eventDays[u].time.from,
							sessionEndTime: reNewed.eventDays[u].time.to,
							eventId: null,
							title: '',
							details: '',
							videoLink: ''
						});
					}
				}

				// 	// remove the old details for old days
				// 	for (var h in reNewed.programDetails.programDailyDetails) {
				// 		delete reNewed.programDetails.programDailyDetails[h];
				// 	}

				// 	// store the daily details in the new dates
				// 	for (var d in reNewed.eventDays) {
				// 		reNewed.dailyDetails.programDailyDetails[reNewed.eventDays[d]] = detailsArray[d];
				// 	}
				// }



				// if(mapLocation.longitude === 0){
				// 	newEvent.coordinates = model.newEvent.coordinates;	
				// }else{
				// 	newEvent.coordinates = [mapLocation.longitude, mapLocation.latitude];
				// }
				
				// for(var x in newEvent){
				// 	model.newEvent[x] = newEvent[x];
				// }

				// model.newEvent = newEvent;
				model.eventDetailsMain = false;
				model.eventProgramDetails = true;
				console.log('the final event to renew is: ', reNewed);
				
				model.newEvent = reNewed;
			}

			
			function reNewEvent(reNewedEvent){
				// reNewedEvent.organizerId = organizerId;
				reNewedEvent.newAddressAdded = model.newAddressAdded;
				reNewedEvent.addressSelected = model.addressSelected;
				// reNewedEvent.newGeoLocationAdded = model.newGeoLocationAdded;
				console.log('the final Event to go to renew', reNewedEvent);
				eventsService
					.reNewEvent(reNewedEvent)
					.then(function(addedEvent){
						console.log('the renewed event is: ', addedEvent);
						$location.url('/organizerProfile/eventsList');
					});
			}

			function logout(){
				authService
					.logout()
					.then(function(){
						$location.url('/');
					});
			}

		function cancelRenew() {
			var url = "/OrganizerProfile";
			$location.url(url);
		}

			function addNewAddress(){
				console.log('new address added');
				model.newAddressAdded = true;
				model.addressSelected = false;
			}
			
			

		}
})();