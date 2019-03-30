(function() {
	angular
		.module('whatsOnJordan')
		.controller('makerEventsListController', makerEventsListController);

	function makerEventsListController(eventsService, $location, loggedMaker, authService) {
		var model = this;

		function init() {
			if(!loggedMaker){
				$location.url('/login');
			}
			model.loggedMaker = loggedMaker;
			// var makerName = loggedMaker.name;
			// var loggedMakerId = loggedMaker._id;
			// model.makerName = makerName;
			// model.makerId = loggedMakerId;
			// console.log('the logged maker', loggedMaker);
			
			eventsService
				.findEventsByMakerId(loggedMaker.maker.id)
				.then(function(events){
					// console.log('the maker events are:', events.data);
					model.eventsList = events.data;
				});

			
			// authService
			// 		.checkAuthLogin()
			// 		.then(function(result){
			// 			if(result){
			// 				model.loggedUser = result;
			// 			}
			// 		});

		}
		init();

		model.removeEvent = removeEvent;
		model.logout = logout;
		model.reCreateEvent = reCreateEvent;
		// model.findUserByEventId = findUserByEventId

		// function findUserByEventId(eventId){
		// 	console.log(eventId);
		// }

		function logout(){
			authService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}


		function removeEvent(makerId, eventId){
			//var makerId = $rootScope.loggedMaker._id;
			eventsService.removeEvent(makerId, eventId)
				.then(function(deleted){
					var url = "/makerProfile";
					$location.url(url);
				});
		}

		function reCreateEvent(event){
			
			var unnecessaryProperties = ['created', 'eventDays', 'registeredMembers', 'discountedMembers', 'expenses', '_id', 'startingDate', 'expiryDate', 'makerId', 'special', '__v', 'approved', '$$hashKey'];
			for(var i in unnecessaryProperties){
				delete(event[unnecessaryProperties[i]]);
			}
			console.log(event);
			
			// var x = {
			// 	name: "football xxxxxxx", 
			// 	category: "sport", 
			// 	subcategory: "Football", 
			// 	details: "details about the event", 
			// 	startingDate: 'Sat Sep 01 2018' ,
			// 	address: "Amman",
			// 	coordinates: [35.8770609, 32.0033613],
			// 	daysPerWeek: [6, 1, 3],
			// 	eventDays: ["Sat Sep 01 2018", "Mon Sep 03 2018", "Wed Sep 05 2018", "Sat Sep 08 2018", "Mon Sep 10 2018", "Wed Sep 12 2018", "Sat Sep 15 2018", "Mon Sep 17 2018", "Wed Sep 19 2018", "Sat Sep 22 2018", "Mon Sep 24 2018", "Wed Sep 26 2018", "Sat Sep 29 2018"],
			// 	expiryDate: 'Sun Sep 30 2018',
			// 	images: {img750x450: "http://sandiegosoccercamp.com/wp-content/uploads/2015/05/Camp-Pic-4-750x450.jpg", img1200x300: "https://www.pulsedursley.co.uk/wp-content/uploads/2016/04/Child-swimming-lessons-1.jpg"},
			// 	price: "200",
			// 	programDailyDetails: {'Sat Sep 01 2018': {title: "step 1", details: "step one details", videoLink: "https://youtu.be/6HxyZjKqc6E?t=2"}},
			// };
			// var temporaryEventObject = {
			// 						    // "_id": {"$oid": "5b00936c816d9c0004eb89e9"},
			// 						    images: {"img750x450": "http://sandiegosoccercamp.com/wp-content/uploads/2015/05/Camp-Pic-4-750x450.jpg", "img1200x300": "https://www.i9sportsfranchise.com/wp-content/uploads/2017/02/header25-1200x300.jpg"},
			// 						    // "created": {"$date": "2018-05-19T21:10:19.314Z"},
			// 						    details: "Football course for kids 6-14 years old, concentrate at full body works, team spirit in lovely friendly atmosphere, at top rated schools, Now at Alsamiya International School. the program based on the most famous camp \"Juventus camp\" fulfilled by certificated trainers.",
			// 						    name: "Football course",
			// 						    category: "Sport",
			// 						    subcategory: "Football",
			// 						    startingDate: {"$date": "2018-08-31T21:00:00.000Z"},
			// 						    expiryDate: {"$date": "2018-09-29T21:00:00.000Z"},
			// 						    price: 200,
			// 						    // "makerId": {"$oid": "5b00233cfef8af0004b1cb9f"},
			// 						    // "special": false,
			// 						    // "__v": 78,
			// 						    // "approved": true,
			// 						    coordinates: [35.831666705479904,31.97074372597298],
			// 						    // "registeredMembers": [{"$oid": "5b09f6368a512300047bb1a8"}, {"$oid": "5aff61d364423c365d5d2bb6"}],
			// 						    daysPerWeek: [1,3,6],
			// 						    eventDays: ["Sat Sep 01 2018","Mon Sep 03 2018","Wed Sep 05 2018","Sat Sep 08 2018","Mon Sep 10 2018","Wed Sep 12 2018","Sat Sep 15 2018","Mon Sep 17 2018","Wed Sep 19 2018","Sat Sep 22 2018","Mon Sep 24 2018","Wed Sep 26 2018","Sat Sep 29 2018"],
			// 						    programDailyDetails: {"Sat Sep 01 2018": {"title": "Learn & study basic soccer rules","details": "We\u2019re not saying that your kid has to start memorizing the soccer rule book, but it would help if an older kid or parent explained very quickly the basic rules of soccer. It would be even better to show your kid what a real soccer court looks like, whether it\u2019s a field or even a blacktop, as a great way to help them visualize the soccer game upon first hearing about it.","videoLink": "https://www.youtube.com/embed/1vNmYNH8d4I"},"Mon Sep 03 2018": {"title": "Kick around the soccer ball","details": "Familiarize your kid with the soccer ball by simply having them kick it around \u2013 either against a wall or into a goalpost. Some parents may even let their kids tap a soccer ball around the house just to get used to it, but we\u2019d understand if you are hesitant to do so!!","videoLink": "https://www.youtube.com/embed/QLUqv6W8L8s"}},
			// 						    address: "Amman, King Hussein Business Park",
			// 						    // "discountedMembers": ["5aff61d364423c365d5d2bb6"],
			// 						    // "expenses": [{"expenseDate": {"$date": "2018-08-08T21:00:00.000Z"},"expenseType": "Salary","expenseDetails": "Majid","expenseAmount": 100},{"expenseDate": {"$date": "2018-08-08T21:00:00.000Z"},"expenseType": "Hospitality","expenseDetails": "water","expenseAmount": 10}],
			// 						    frozeMembers: [{"days": ["Wed Sep 26 2018","Sat Sep 29 2018"],"userId": "5b09f6368a512300047bb1a8"}]
			// 						};
		}


	}
})();