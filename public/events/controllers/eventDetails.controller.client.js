(function(){
	angular
		.module('whatsOnJordan')
		.controller('eventDetailsController', eventDetailsController);

		function eventDetailsController($routeParams, eventsService, userService, $location){
			var model = this;

			function init(){
				model.error2 = null;
				var eventId = $routeParams.eventId;
				// var eventDetails = eventsService.findEventByEventId(eventId);
				eventsService.findEventByEventId(eventId)
					.then(function(eventDetails){
						model.eventDetails = eventDetails;
					});
				// check if there any user has already logged in to use it instead of the $rootScope
				userService
					.checkUserLogin()
					.then(function(result){
						if(result){
							model.loggedUser = result;
							model.loggedUser.member.DOB = new Date(model.loggedUser.member.DOB);
						}
					});

				
			}
			init();

			model.eventRegistration = eventRegistration;
			model.logout = logout;

			function logout(){
				userService
					.logout()
					.then(function(){
						$location.url('/');
					});
			}



			function eventRegistration(event, user){
				var eventId = event.id;
				var memberId = user.member.id;
				console.log('event name: ', event.name , ' user name:', user.member.firstName);
				if (!model.loggedUser){
					model.error1 = 'Please login or sign-up to register on this event';
					$('#eventRegistrationModal').modal('hide');
					$('html, body').animate({ scrollTop: 0 }, 'slow');
					return;
				} else {
					var userId = model.loggedUser.id;
					var eventsList = model.loggedUser.registeredEventsList;
					for(var e in eventsList){
						if(eventsList[e].id === event.id){
							model.error2 = 'You already registered for this event';
							return;
						}
					}
					
					userService
						.addEventToUser(eventId, memberId)
						.then(function (response){
							$location.url('/userProfile');
					});
					if(user.termsAcceptance){
						$('#eventRegistrationModal').modal('hide');
					}else{
						$("#registrationForm").validate({
						    rules: {
						      termsAcceptance: {
						      	required: true
						      }
						    },
						    messages: {
						      termsAcceptance: {
						      	required: "<b style='color: red;'>Please accept the terms and conditions</b>"
						      }
						    }
						  });
						alert('Please read and accept the terms and conditions');
						// model.termsError = 'You should read and accept the terms and conditions to register for this event';
						// $('#registrationForm').css('background-color', 'red');
					}
				}

			}

		}

})();