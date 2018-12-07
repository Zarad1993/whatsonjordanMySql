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
							model.loggedUser.DOB = new Date(model.loggedUser.DOB);
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
				if (!model.loggedUser){
					model.error1 = 'Please login or sign-up to register on this event';
					$('#eventRegistrationModal').modal('hide');
					$('html, body').animate({ scrollTop: 0 }, 'slow');

					return;
				} else {
					var userId = model.loggedUser._id;
					var eventsList = model.loggedUser.registeredEventsList;
					for(var e in eventsList){
						if(eventsList[e]._id === event._id){
							model.error2 = 'You already registered for this event';
							return;
						}
					}
					userService
						.addEventToUserEventsList(event, user)
						.then(function (response){
							$location.url('/userProfile');
					});
					if(user.termsAcceptance){
						$('#eventRegistrationModal').modal('hide');
					}else{
						$("#registrationForm").validate({
						    rules: {
						      // notes: {
						      //   required: true,
						      //   minlength: 8
						      // },
						      termsAcceptance: {
						      	required: true
						      }
						    },
						    messages: {
						      // notes: {
						      //   required: "Please enter some data",
						      //   minlength: "Your data must be at least 8 characters"
						      // },
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