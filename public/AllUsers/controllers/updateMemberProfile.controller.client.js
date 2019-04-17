(function() {
	angular
		.module('whatsOnJordan')
		.controller('updateMemberProfile', updateMemberProfile);

	function updateMemberProfile(authService, getterService, schoolsService, nationalitiesService, loggedMember, $location) {
		var model = this;

		function init() {
			
			model.memberProfile = loggedMember.chosenRole;
			model.allRoles = loggedMember.allRoles;
			model.newMedicalIssue = null;

			if (model.memberProfile.contact.DOB){
				model.memberProfile.contact.DOB = new Date(model.memberProfile.contact.DOB);
			}
			
			// model.memberProfile = loggedMember;
			// model.loggedMember = loggedMember;
			
			getterService
				.getPhoneTypes()
				.then(function(phoneTypes){
					model.phoneTypes = phoneTypes.data;
				})

			getterService
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
		model.addedPhones = [];
		model.addMedicalIssue = addMedicalIssue;
		model.medicalIssuesStatus = medicalIssuesStatus;
		model.removeMedicalIssue = removeMedicalIssue;
		// model.DOB = new Date(loggedMember.DOB);


		function updateProfile(updatedUserProfile){
			authService
				.updateProfile(updatedUserProfile)
				.then(function(result){
					console.log('Profile Updated', result);
					// model.logout();
					$location.url('/profile');
				})
		}


		function medicalIssuesStatus(){
			if (model.memberProfile.contact.medicalStatus == 'Yes'){
				model.memberProfile.contact.medicalIssues.push({
					title: null,
					details: null
				});
			}
		}


		function addMedicalIssue(){
			model.memberProfile.contact.medicalIssues.push({
				title: null,
				details: null
			});
		}

		function removeMedicalIssue(index){
			console.log('the index is: ', index);
			model.memberProfile.removedMedical = model.memberProfile.contact.medicalIssues[index];
			model.memberProfile.contact.medicalIssues.splice(index, 1);
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
			authService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}



		function removeRegisteredEvent(eventId){
			// var _userId = $routeParams.userId;
			authService
				.removeRegisteredEvent(loggedMember._id, eventId)
				.then(function(response){
					$location.url('/profile');
				});
		}

	}
})();