(function() {
	angular
		.module('whatsOnJordan')
		.controller('adminController', adminController);

	function adminController(authService, eventsService, roleService, loggedAdmin, $location, $route) {
		var model = this;

		function init() {
			if(!loggedAdmin){
				$location.url('/login');
			}
			roleService
				.getAllRoles()
				.then(function(roles){
					model.roles = roles.data;
				})

			
			model.loggedAdmin = loggedAdmin;
			// model.adminPage = loggedAdmin;
			model.users = null;
			model.events = null;
			console.log('the logged in is: ', model.loggedAdmin);
			
		}
		init();

		model.logout = logout;
		model.getAllUsers = getAllUsers;
		model.getAllEvents = getAllEvents;
		model.updateEventByAdmin = updateEventByAdmin;
		model.getAllFeedbacks = getAllFeedbacks;
		model.updateFeedbackByAdmin = updateFeedbackByAdmin;
		model.addAuthRole = addAuthRole;

		function updateFeedbackByAdmin(feedback){
			authService
				.updateFeedbackByAdmin(feedback)
				.then(getAllFeedbacks);
		}

		function getAllFeedbacks(){
			model.events = null;
			model.users = null;
			authService
				.getAllFeedbacks()
				.then(function(feedbacks){
					model.feedbacks = feedbacks.data;
				});
		}

		function getAllUsers(){
			model.events = null;
			model.feedbacks = null;
			return authService
				.getAllUsers()
				.then(function (users){
					if(users){
						model.users = users.data;
						console.log('the users are: ', users);
						
					}
				});
		}

		

		function getAllEvents(){
			model.users = null;
			model.feedbacks = null;
			eventsService
					.getAllEvents()
					.then(function(events){
						if(events){
							model.events = events;	
						}
					});
		}

		function updateEventByAdmin(event){
			eventsService
					.updateEventByAdmin(event)
					.then(getAllEvents);
		}



		function logout(){
			authService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}

		function addAuthRole(user){
			authService
				.addAuthRole(user)
				.then(function(result){
					console.log('user role has been changed');
					$route.reload();
				})
		}

	}
})();