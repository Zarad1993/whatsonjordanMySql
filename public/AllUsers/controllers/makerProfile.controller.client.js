(function() {
	angular
		.module('whatsOnJordan')
		.controller('makerProfileController', makerProfileController);

	function makerProfileController(userService, eventsService, loggedMaker, $location) {
		var model = this;
		model.logout = logout;
		model.updateMakerProfile = updateMakerProfile;

		function init() {
			if(!loggedMaker){
				$location.url('/login');
			}
			model.loggedMaker = loggedMaker;
			
			// if (loggedMaker.DOB){
			// 	loggedMaker.DOB = new Date(loggedMaker.DOB);
			// }
			model.makerProfile = loggedMaker;
			
			eventsService
				.findEventsByMakerId(loggedMaker.maker.id)
				.then(function (events) {
					model.eventsList = events.data;
				});
		}
		init();

		function updateMakerProfile(updatedMakerProfile){
			console.log('the updated maker profile: ', updatedMakerProfile);
			userService
				.updateMakerProfile(updatedMakerProfile)
				.then(function(result){
					console.log('Profile Updated');
					$location.url('/profile');
				})
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