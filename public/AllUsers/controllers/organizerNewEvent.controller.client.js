(function(){
	angular
		.module('whatsOnJordan')
		.controller('organizerNewEventController', organizerNewEventController);

	function organizerNewEventController($location, eventsService, getterService, loggedOrganizer, authService){
			var model = this;
			function init(){
				if(!loggedOrganizer){
					$location.url('/login')
				}
				

				model.organizerProfile = loggedOrganizer.chosenRole;
				model.allRoles = loggedOrganizer.allRoles;


				console.log('logged Organizer: ', loggedOrganizer);
				

				model.newEventMain = true;
				model.newAddressAdded = false;
				model.addressSelected = false;
				// model.newGeoLocationAdded = false;
				var organizerId = model.organizerProfile.contact.id;
				
				
				getterService
					.getEventHelpers(organizerId)
					.then(function (result) {
						var eventHelpers = result.data;
						console.log('the event helpers:', eventHelpers);
						for(var i in eventHelpers){
							console.log('the helper: ', eventHelpers[i]);
							console.log('each event: ', Object.keys(eventHelpers[i])[0] );
							var key = Object.keys(eventHelpers[i])[0];
							model[key] = eventHelpers[i][Object.keys(eventHelpers[i])[0]];
						}
					})
					.then(function(){
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
							});
					
				
				
				// getterService
				// 	.getAllCategories()
				// 	.then(function (categories) {
				// 			model.allCategories = categories.data;
				// 			getterService
				// 				.getAllSubCategories()
				// 				.then(function (subCategories) {
				// 					model.allSubCategories = subCategories.data;
				// 				})
				// 		})
				// 		.then(function(){
				// 			getterService
				// 				.getAllAgeGroups()
				// 				.then(function(allAgeGroups){
				// 					model.allAgeGroups = allAgeGroups.data;
				// 				});
				// 		})
				// 		.then(function () {
				// 			addressService
				// 				.getOrganizerAddresses(organizerId)
				// 				.then(function (allAddresses) {
				// 					model.allAddresses = allAddresses.data;
				// 				});
				// 		})
				// 		.then(function () {
				// 			eventsService
				// 				.getMapBoxKey()
				// 				.then(function(mapBoxKey){
				// 					model.mapBoxKey = mapBoxKey.data;
			
				// 					// MapBox Maps
				// 					// Get the access token from the server
				// 					mapboxgl.accessToken = model.mapBoxKey;
				// 					$('#mapModal').on('shown.bs.modal', function() {
				// 						// Initilise the map 
				// 						var map = new mapboxgl.Map({
				// 							container: 'mapForLocation',
				// 							// style: 'mapbox://styles/mapbox/streets-v10',
				// 							style: 'mapbox://styles/mapbox/satellite-streets-v9',
				// 							center: [35.87741988743201, 32.003009804995955],
				// 							// center: [model.position.currentposition.lng, model.position.currentposition.lat],
				// 							zoom: 12
				// 						});
			
				// 						// Show map controller
				// 						map.addControl(new mapboxgl.NavigationControl());
			
				// 						// Get the location from the map
				// 						map.on('click', function(e) {
				// 							// var latitude = e.lngLat.lat;
				// 							// var longitude = e.lngLat.lng;
				// 							model.mapLocation.latitude = e.lngLat.lat;
				// 							model.mapLocation.longitude = e.lngLat.lng;
				// 							document.getElementById('mapLat').innerHTML = model.mapLocation.latitude;
				// 							document.getElementById('mapLng').innerHTML = model.mapLocation.longitude;
				// 						});
			
				// 					});	
				// 				})
				// 		})
					
			}
			init();
			
			model.createEvent = createEvent;
			model.logout = logout;
			model.cancelCreate = cancelCreate;
			model.createEventDetails = createEventDetails;
			model.getCurrentLocation = getCurrentLocation;
			model.getLocationFromMap = getLocationFromMap;
			model.mapLocation = {longitude: 0, latitude: 0};
			model.addNewAddress = addNewAddress;
			model.selectAddress = selectAddress;
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


			function createEventDetails(newEvent, mapLocation){
				// create dates based on start-end dates and the days of the weeks
				var start = new Date(newEvent.main.startingDate);
				var end = new Date(newEvent.main.expiryDate);
				// var days = [];
				// var eventDays = [];
				
				
				
				// to create event days for the whole event based on days per week
				for (start; end>start; start.setDate(start.getDate()+1)){
					inner:
					for(var j in model.daysOfWeek){
						if (start.getDay() === Number(j) && model.daysOfWeek[j].day==true){
							model.eventDays.push({date: start.toDateString(), time: {from: model.daysOfWeek[j].from, to: model.daysOfWeek[j].to}});
							break inner;
						}
					}
				}
				// newEvent.main.daysPerWeek = [];
				// remove unselected days
				for (var i in model.daysOfWeek) {
					if (model.daysOfWeek[i].day == false) {
						delete (model.daysOfWeek[i]);
					// }else{
					// 	// delete (model.daysOfWeek[i].day);
					// 	newEvent.main.daysPerWeek.push(Number(i));
					// 	// newEvent.main.daysWithSessions.push()
					}
					// var et = Number(i);
					// var leng = model.daysOfWeek.length - 1;
					// if(et == leng){
					// 	newEvent.main.daysPerWeek = model.daysOfWeek;
					// }
				}
				
				newEvent.main.daysPerWeek = model.daysOfWeek;
				// newEvent.eventDays = eventDays;
				newEvent.geoLocation = mapLocation;
				model.newEvent = newEvent;
				model.newEventMain = false;
				model.newEventProgramDetails = true;
			}

			
			function createEvent(newEvent){
				newEvent.organizerId = model.organizerProfile.contact.id;
				newEvent.newAddressAdded = model.newAddressAdded;
				newEvent.addressSelected = model.addressSelected;
				newEvent.programDetails = [];
				for(var i in model.eventDays){
					newEvent.programDetails.push({
						date: model.eventDays[i].date,
						sessionStartTime: model.eventDays[i].time.from,
						sessionEndTime: model.eventDays[i].time.to,
						title: model.eventDays[i].dailyDetails ? model.eventDays[i].dailyDetails.title : null,
						details: model.eventDays[i].dailyDetails ? model.eventDays[i].dailyDetails.details : null,
						videoLink: model.eventDays[i].dailyDetails ? model.eventDays[i].dailyDetails.videoLink : null,
					})
				}
				
				// newEvent.newGeoLocationAdded = model.newGeoLocationAdded;
				console.log('the event to create', newEvent);
				eventsService
					.addNewEvent(newEvent)
					.then(function(addedEvent){
						$location.url('/organizerProfile/eventsList');
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

		function cancelCreate() {
			var url = "/OrganizerProfile";
			$location.url(url);
		}

			function addNewAddress() {
				console.log('new address added');
				model.newAddressAdded = true;
				model.addressSelected = false;
			}
			
			

		}
})();






/*

var eventToCreate = {
    address:{
            active: null,
            building: "1",
            city: "Dabouq",
            contactId: "0a9d9440-61cd-11e9-b0db-75511edbb6dc",
            country: "Jordan",
            createdAt: "2019-04-19T19:34:58.000Z",
            geoLocation: {
                createdAt: "2019-04-19T19:34:58.000Z",
                id: 2,
                latitude: "31.97650090843871",
                longitude: "35.83683643263015",
                updatedAt: "2019-04-19T19:34:58.000Z"
            },
            geoLocationId: 2,
            id: 4,
            note: null,
            province: "Amman",
            street: "Almadina altibbiya",
            updatedAt: "2019-04-19T19:34:58.000Z",
        },
    age:{
        ageGroup: { id: 2, name: "From 7 to 9", from: 7, to: 9, createdAt: "2019-04-19T14:05:02.000Z", updatedAt: "2019-04-19T14:05:02.000Z"}
    },
    category:{
        categoryId: 2,
        subCategoryId: 4
    },
    programDetails: [
        {date: "Sat Jun 01 2019", time: { from: 'time', to: 'time' }, dailyDetails: {details: "1", title: "1", videoLink: "1"}},
        {date: "Sun Jun 02 2019", time: {}, dailyDetails: {}},
        {date: "Tue Jun 04 2019", time: {}},
        {date: "Thu Jun 06 2019", time: {}},
        {date: "Sat Jun 08 2019", time: {}},
        {date: "Sun Jun 09 2019", time: {}},
        {date: "Tue Jun 11 2019", time: {}},
        {date: "Thu Jun 13 2019", time: {}},
        {date: "Sat Jun 15 2019", time: {}},
        {date: "Sun Jun 16 2019", time: {}},
        {date: "Tue Jun 18 2019", time: {}},
        {date: "Thu Jun 20 2019", time: {}},
        {date: "Sat Jun 22 2019", time: {}},
        {date: "Sun Jun 23 2019", time: {}},
        {date: "Tue Jun 25 2019", time: {}},
        {date: "Thu Jun 27 2019", time: {}},
        {date: "Sat Jun 29 2019", time: {}},
        {date: "Sun Jun 30 2019", time: {}},
    ],
    geoLocation:{
        latitude: 0,
        longitude: 0
    },
    main:{
        name: "football xxxxxxx",
        details: "deta",
        startingDate: 'Sat Jun 01 2019 00:00:00 GMT+0300 (Eastern European Summer Time)',
        expiryDate: 'Mon Jul 01 2019 00:00:00 GMT+0300 (Eastern European Summer Time)',
        sessionEndTime: 'Thu Jan 01 1970 01:00:00 GMT+0200 (Eastern European Standard Time)',
        sessionStartTime: 'Thu Jan 01 1970 01:00:00 GMT+0200 (Eastern European Standard Time)',
        price: "100",
        images: {
            img750x450: "https://s-media-cache-ak0.pinimg.com/originals/11/63/2b/11632b5466b39feef25d992da1d47fd1.jpg",
            img1200x300: "https://www.i9sportsfranchise.com/wp-content/uploads/2017/02/header25-1200x300.jpg"
        },
        termsAndConditions: "tesrm",
        daysPerWeek: [0, 2, 4, 6],
        sessionsPerDay:[
            0: { from: 'Thu Jan 01 1970 01: 00: 00 GMT + 0200(Eastern European Standard Time)', to: 'Thu Jan 01 1970 02: 00: 00 GMT + 0200(Eastern European Standard Time)' },
            2: { from: 'Thu Jan 01 1970 02: 00: 00 GMT + 0200(Eastern European Standard Time)', to: 'Thu Jan 01 1970 03: 00: 00 GMT + 0200(Eastern European Standard Time)' },
            4: { from: 'Thu Jan 01 1970 03: 00: 00 GMT + 0200(Eastern European Standard Time)', to: 'Thu Jan 01 1970 04: 00: 00 GMT + 0200(Eastern European Standard Time)' },
            6: { from: 'Thu Jan 01 1970 04: 00: 00 GMT + 0200(Eastern European Standard Time)', to: 'Thu Jan 01 1970 05: 00: 00 GMT + 0200(Eastern European Standard Time)' },
        ]
    },
    addressSelected: true,
    newAddressAdded: false,
    organizerId: "0a9d9440-61cd-11e9-b0db-75511edbb6dc"

}

*/