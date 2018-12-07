(function(){
	angular
		.module('whatsOnJordan')
		.controller('makerNewEventController', makerNewEventController);

		function makerNewEventController($location, eventsService, loggedMaker, userService){
			var model = this;
			function init(){
				model.newEventMain = true;
				model.loggedMaker = loggedMaker;
				eventsService
					.getMapBoxKey()
					.then(function(mapBoxKey){
						model.mapBoxKey = mapBoxKey.data;

						// MapBox Maps
					    // Get the access token from the server
					    mapboxgl.accessToken = model.mapBoxKey;
						
						$('#mapModal').on('shown.bs.modal', function() {
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
							map.on('click', function(e) {
							    // var latitude = e.lngLat.lat;
							    // var longitude = e.lngLat.lng;
							    model.mapLocation.latitude = e.lngLat.lat;
								model.mapLocation.longitude = e.lngLat.lng;
							    document.getElementById('mapLat').innerHTML = model.mapLocation.latitude;
							    document.getElementById('mapLng').innerHTML = model.mapLocation.longitude;
							});

						});	
						
						
 						

					});
			}
			init();
			var _makerId = loggedMaker._id;
			
			model.createEvent = createEvent;
			model.logout = logout;
			model.createEventDetails = createEventDetails;
			model.getCurrentLocation = getCurrentLocation;
			model.getLocationFromMap = getLocationFromMap;
			model.mapLocation = {longitude: 0, latitude: 0};


			function getCurrentLocation() {
			    if (navigator.geolocation) {
			        navigator.geolocation.getCurrentPosition(showPosition);
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
			}

			function createEventDetails(newEvent, daysOfWeek, mapLocation){
				// create dates based on start-end dates and the days of the weeks
				var start = new Date(newEvent.startingDate);
				var end = new Date(newEvent.expiryDate);
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
				newEvent.daysPerWeek = days;
				
				for (start; end>start; start.setDate(start.getDate()+1)){
					inner:
					for(var j in days){
						if(start.getDay() === days[j]){
							eventDays.push(start.toDateString());
							break inner;
						}
					}
				}
				newEvent.eventDays = eventDays;
				newEvent.coordinates = [mapLocation.longitude, mapLocation.latitude];
				model.newEvent = newEvent;
				model.newEventMain = false;
				model.newEventProgramDetails = true;
			}

			
			function createEvent(newEvent){
				newEvent.makerId = _makerId;
				console.log(newEvent.makerId);
				eventsService
					.addNewEvent(newEvent)
					.then(function(addedEvent){
						$location.url('/makerProfile/eventsList');
					});
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