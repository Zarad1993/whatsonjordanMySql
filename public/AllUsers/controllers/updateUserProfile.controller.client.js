(function() {
	angular
		.module('whatsOnJordan')
		.controller('updateUserProfile', updateUserProfile);

	function updateUserProfile(userService, gradesService, schoolsService, nationalitiesService, loggedUser, $location) {
		var model = this;

		function init() {
			loggedUser.member.DOB = new Date(loggedUser.member.DOB);
			model.userProfile = loggedUser;
			model.loggedUser = loggedUser;
			gradesService
				.getAllGrades()
				.then(function(result){
					console.log('the grades: ', result.data);
					model.allGrades = result.data;
				});
			schoolsService
				.getAllSchools()
				.then(function(schools){
					console.log('the schools are: ', schools.data);
					model.allSchools = schools.data;
				});
			nationalitiesService
				.getAllNationalities()
				.then(function(nationalities){
					console.log('the nationalities are: ', nationalities.data);
					model.nationalities = nationalities.data;
				});
			
		}
		init();

		model.logout = logout;
		model.removeRegisteredEvent = removeRegisteredEvent;
		model.updateProfile = updateProfile;
		// model.DOB = new Date(loggedUser.DOB);

		function updateProfile(updatedUserProfile){
			userService
				.updateProfile(updatedUserProfile)
				.then(function(result){
					console.log('Profile Updated', result);
					// model.logout();
					$location.url('/profile');
				})
		}

		function ValidateSize(file) {
	        		var FileSize = file.files[0].size / 1024 / 1024; // in MB
	        		if (FileSize > 2) {
	            		alert('File size exceeds 2 MB');
	        		} else {
	        			alert(file.files[0].size);
	        		}
    			}




		function logout(){
			userService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}



		function removeRegisteredEvent(eventId){
			// var _userId = $routeParams.userId;
			userService
				.removeRegisteredEvent(loggedUser._id, eventId)
				.then(function(response){
					$location.url('/profile');
				});
		}

	}
})();