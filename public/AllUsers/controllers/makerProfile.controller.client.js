(function() {
	angular
		.module('whatsOnJordan')
		.controller('makerProfileController', makerProfileController);

	function makerProfileController(authService, getterService, eventsService, loggedOrganizer, $location) {
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
			
			model.makerProfile = loggedOrganizer.chosenRole;
			model.allRoles = loggedOrganizer.allRoles;
			
			// model.loggedOrganizer = loggedOrganizer;
			if(model.makerProfile.contact.addresses.length <1){
				model.createAddress = true;
			}
			model.newAddressIndex = model.makerProfile.contact.addresses.length;
			// console.log('the logged in is: ', loggedOrganizer);
			console.log('the addresses list: ', model.makerProfile.contact.addresses);



			
			
			getterService
				.getPhoneTypes()
				.then(function (phoneTypes) {
					model.phoneTypes = phoneTypes.data;
				})
			
			
			
			// for(var i in loggedOrganizer.roles){
			// 	if (loggedOrganizer.roles[i].name == loggedOrganizer.chosenRole){
			// 		model.makerProfile = loggedOrganizer.roles[i];
			// 	}
			// }

			// if (model.allRoles.roles.length > 1) {
			// 	for (var i in model.allRoles.roles) {
			// 		if (model.allRoles.roles[i].name == model.allRoles.chosenRole) {
			// 			model.makerProfile = loggedOrganizer.roles[i];
			// 		}
			// 	}
			// } else {
			// 	model.makerProfile = loggedOrganizer.roles[0];
			// }
			
			// eventsService
			// 	.findEventsByMakerId(loggedOrganizer.maker.id)
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