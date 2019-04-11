(function(){
	angular
		.module('whatsOnJordan')
		.controller('makerNewEventController', makerNewEventController);

	function makerNewEventController($location, eventsService, addressService, getterService, loggedOrganizer, authService){
			var model = this;
			function init(){
				if(!loggedOrganizer){
					$location.url('/login')
				}
				model.newEventMain = true;
				model.loggedOrganizer = loggedOrganizer;
				model.newAddressAdded = false;
				model.addressSelected = false;
				// model.newGeoLocationAdded = false;
				var makerId = loggedOrganizer.makerId;
				getterService
					.getAllCategories()
					.then(function (categories) {
						// console.log('the categories:', categories);
							model.allCategories = categories.data;
							getterService
								.getAllSubCategories()
								.then(function (subCategories) {
									// console.log('the sub categories:', subCategories);
									model.allSubCategories = subCategories.data;
								})
						})
						.then(function(){
							getterService
								.getAllAgeGroups()
								.then(function(allAgeGroups){
									model.allAgeGroups = allAgeGroups.data;
								});
						})
						.then(function () {
							addressService
								.getMakerAddresses(makerId)
								.then(function (allAddresses) {
									model.allAddresses = allAddresses.data;
								});
						})
						.then(function () {
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
								})
						})
					
			}
			init();
			
			model.createEvent = createEvent;
			model.logout = logout;
			model.createEventDetails = createEventDetails;
			model.getCurrentLocation = getCurrentLocation;
			model.getLocationFromMap = getLocationFromMap;
			model.mapLocation = {longitude: 0, latitude: 0};
			model.addNewAddress = addNewAddress;
			model.selectAddress = selectAddress;

			function selectAddress(){
				model.addressSelected = true;
				model.newAddressAdded = false;
			}


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
				// model.newAddressAdded = false;
				// model.newGeoLocationAdded = true;
			}

			function createEventDetails(newEvent, daysOfWeek, mapLocation){
				// create dates based on start-end dates and the days of the weeks
				var start = new Date(newEvent.main.startingDate);
				var end = new Date(newEvent.main.expiryDate);
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
				newEvent.main.daysPerWeek = days;
				
				// to create event days for the whole event based on days per week
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
				newEvent.geoLocation = mapLocation;
				model.newEvent = newEvent;
				model.newEventMain = false;
				model.newEventProgramDetails = true;
			}

			
			function createEvent(newEvent){
				newEvent.makerId = model.loggedOrganizer.makerId;
				newEvent.newAddressAdded = model.newAddressAdded;
				newEvent.addressSelected = model.addressSelected;
				// newEvent.newGeoLocationAdded = model.newGeoLocationAdded;
				// console.log('the event to create', newEvent);
				eventsService
					.addNewEvent(newEvent)
					.then(function(addedEvent){
						$location.url('/makerProfile/eventsList');
						console.log('the created event is: ', addedEvent);
					});
			}

			function logout(){
				authService
					.logout()
					.then(function(){
						$location.url('/');
					});
			}

			function addNewAddress() {
				console.log('new address added');
				model.newAddressAdded = true;
				model.addressSelected = false;
			}
			
			

		}
})();