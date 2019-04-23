(function() {
	angular
		.module('whatsOnJordan')
		.controller('organizerProfileController', organizerProfileController);

	function organizerProfileController(authService, getterService, eventsService, loggedOrganizer, $location) {
		var model = this;
		model.logout = logout;
		model.updateOrganizerProfile = updateOrganizerProfile;

		function init() {
			console.log('reached');
			// See the role name?
			// {role}
			// if not Maker and not logged
			// $location.url('/login');
			
			if(!loggedOrganizer){
				$location.url('/login');
			}
			
			model.organizerProfile = loggedOrganizer.chosenRole;
			model.allRoles = loggedOrganizer.allRoles;
			
			// model.loggedOrganizer = loggedOrganizer;
			if(model.organizerProfile.contact.addresses.length <1){
				model.createAddress = true;
			}
			model.newAddressIndex = model.organizerProfile.contact.addresses.length;
			// console.log('the logged in is: ', loggedOrganizer);
			console.log('the addresses list: ', model.organizerProfile.contact.addresses);
	
			
			getterService
				.getPhoneTypes()
				.then(function (phoneTypes) {
					model.phoneTypes = phoneTypes.data;
				});
			
			// eventsService
			// 	.findEventsByOrganizerId(model.organizerProfile.contact.id)
			// 	.then(function (events) {
			// 		model.eventsList = events.data;
			// 	});
		}
		init();

		function updateOrganizerProfile(updatedMakerProfile){
			console.log('the updated maker profile: ', updatedMakerProfile);
			authService
				.updateProfile(updatedMakerProfile)
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