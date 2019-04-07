(function() {
	angular
		.module('whatsOnJordan')
		.controller('makerProfileController', makerProfileController);

	function makerProfileController(authService, eventsService, loggedMaker, $location) {
		var model = this;
		model.logout = logout;
		model.updateMakerProfile = updateMakerProfile;

		function init() {
			console.log('reached');
			// See the role name?
			// {role}
			// if not Maker and not logged
			// $location.url('/login');
			
			if(!loggedMaker){
				$location.url('/login');
			}
			
			model.makerProfile = loggedMaker.chosenRole;
			model.allRoles = loggedMaker.allRoles;
			
			// model.loggedMaker = loggedMaker;

			console.log('the logged in is: ', loggedMaker);
			
			
			
			
			// for(var i in loggedMaker.roles){
			// 	if (loggedMaker.roles[i].name == loggedMaker.chosenRole){
			// 		model.makerProfile = loggedMaker.roles[i];
			// 	}
			// }

			// if (model.allRoles.roles.length > 1) {
			// 	for (var i in model.allRoles.roles) {
			// 		if (model.allRoles.roles[i].name == model.allRoles.chosenRole) {
			// 			model.makerProfile = loggedMaker.roles[i];
			// 		}
			// 	}
			// } else {
			// 	model.makerProfile = loggedMaker.roles[0];
			// }
			
			// eventsService
			// 	.findEventsByMakerId(loggedMaker.maker.id)
			// 	.then(function (events) {
			// 		model.eventsList = events.data;
			// 	});
		}
		init();

		function updateMakerProfile(updatedMakerProfile){
			console.log('the updated maker profile: ', updatedMakerProfile);
			authService
				.updateMakerProfile(updatedMakerProfile)
				.then(function(result){
					console.log('Profile Updated');
					$location.url('/profile');
				})
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