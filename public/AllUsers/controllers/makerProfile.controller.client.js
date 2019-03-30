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
			model.loggedMaker = loggedMaker;
			
			
			// if (loggedMaker.DOB){
			// 	loggedMaker.DOB = new Date(loggedMaker.DOB);
			// }
			model.makerProfile = loggedMaker;
			
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