(function() {
	angular
		.module('whatsOnJordan')
		.controller('makerProfileController', makerProfileController);

	function makerProfileController(userService, loggedMaker, $location) {
		var model = this;
		model.logout = logout;
		model.updateMakerProfile = updateMakerProfile;

		function init() {
			if(!loggedMaker){
				$location.url('/login');
			}
			model.loggedMaker = loggedMaker;
			loggedMaker.DOB = new Date(loggedMaker.DOB);
			model.makerProfile = loggedMaker;
			console.log(loggedMaker);
		}
		init();

		function updateMakerProfile(updatedMakerProfile){
			userService
				.updateProfile(updatedMakerProfile)
				.then(function(result){
					console.log('Profile Updated');
					$location.url('/profile')
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