(function() {
	angular
		.module('whatsOnJordan')
		.service('userService', userService);

	function userService($http) {

		this.findUserById = findUserById;
		this.findUserByEmail = findUserByEmail;
		this.login = login;
		this.createUser = createUser;
		this.checkUserLogin = checkUserLogin;
		this.logout = logout;
		this.isMaker = isMaker;
		this.isAdmin = isAdmin;
		this.addEventToUser = addEventToUser;
		this.getMemberEvents = getMemberEvents;
		this.removeRegisteredEvent = removeRegisteredEvent;
		this.getAllUsers = getAllUsers;
		this.forgetPassword = forgetPassword;
		this.resetPassword = resetPassword;
		this.updateProfile = updateProfile;
		this.updateMakerProfile = updateMakerProfile;
		this.makePayment = makePayment;
		this.confirmAttendance = confirmAttendance;
		this.updateUserEventParameters = updateUserEventParameters;
		this.freezeMembership = freezeMembership;
		this.removeFrozeDays = removeFrozeDays;
		this.getAllFeedbacks = getAllFeedbacks;
		this.updateFeedbackByAdmin = updateFeedbackByAdmin;
		this.getAllMakers = getAllMakers;
		this.getAllUserTypes = getAllUserTypes;
		this.setUserRole = setUserRole;
		this.submitFeedback = submitFeedback;
		this.getMemberFeedbacks = getMemberFeedbacks;
		


		function init() {}
		init();

		function updateFeedbackByAdmin(feedback){
			return $http.put('/api/admin/updateFeedbackByAdmin', feedback);
		}

		function getAllFeedbacks(){
			return $http.get('/api/user/getAllFeedbacks');
		}


		function removeFrozeDays(ids){
			var userId = ids.userId;
			var originalEventId = ids.originalEventId;
			return $http.delete('/api/user/removeFrozeDays/'+userId+'/'+originalEventId);
		}

		function freezeMembership(freezeObject){
			var url = '/api/user/freezeMembership';
			return $http.put(url, freezeObject);
		}

		function updateUserEventParameters(discount){
			var url = '/api/user/updateUserEventParameters';
			return $http.put(url, discount);
		}

		function submitFeedback(feedbackObject){
			var url = '/api/member/submitFeedback';
			return $http.post(url, feedbackObject);
		}

		function getMemberFeedbacks(memberId){
			var url = '/api/member/getMemberFeedbacks/'+memberId;
			return $http.get(url);
		}

		function confirmAttendance(totalAttended){
			var url = '/api/maker/confirmAttendance';
			return $http.put(url, totalAttended);
		}

		function makePayment(payment){
			var url = '/api/maker/makePayment';
			return $http.put(url, payment);
		}

		function updateProfile(updatedProfile){
			var url = '/api/user/updateProfile';
			return $http.put(url, updatedProfile);
		}

		function updateMakerProfile(updatedMakerProfile){
			var url = '/api/maker/updateMakerProfile';
			return  $http.put(url, updatedMakerProfile);
		}

		function forgetPassword(email){
			var url = '/api/forgetPassword/'+email;
			return $http.post(url);
		}

		function resetPassword(token, password){
			var url = '/api/resetPassword/'+token;
			return $http.post(url, {password: password});
		}


		function getAllUsers(){
			return $http.get('/api/user/getAllUsers');
		}

		function getAllMakers(){
			return $http.get('/api/user/getAllMakers');
		}

		function getAllUserTypes(){
			return $http.get('/api/userTypes/getAllUserTypes');
		}

		function addEventToUser(eventID, memberId){
			var parameters = { eventID: eventID, memberId: memberId};
			var url = '/api/addEventToUser';
				return $http.post(url, parameters);
		}

		function getMemberEvents(memberId){
			var url = '/api/getMemberEvents/'+memberId;
			return $http.get(url);
		}

		function removeRegisteredEvent(userId, eventId){
				var url = '/api/removeEventFromUser/'+eventId;
				return $http.delete(url);
			}

		function logout(){
			return $http
					.post('/api/logout')
					.then(function(response){
						return response.data;
					});
		}



		function findUserById(userId) {
			var url = '/api/user/findUserById/' + userId;
			return $http.get(url)
				.then(function(response) {
					var userProfile = response.data;
					console.log('findUserById has been called called', response);
					return userProfile;
				});
		}

		function findUserByEmail(email) {
			var url = '/api/user/findUserByEmail/'+email;
			return $http.get(url)
				.then(function(response) {
					// original
					// var result = response.dataValues;
					var result = response;
					if(result.email){
						return ('email already exist');
					} else{
						return result;
					}
				});
		}

		function login(username, password) {
			var url = '/api/user/login';
			return $http.post(url, {username: username, password: password})
				.then(function(response) {
					if (response === null){
						return '0';
					}
					// console.log('i found the user: ', response);
					return response;
				},
				function(err){
					return err;
				});
		}

		
	

		function createUser(user){
			return $http.post('/api/user/', user)
				.then(function(response){
					console.log('the response after create a user: ', response.data);
					return(response.data);
				});
		}




		function checkUserLogin(){
			var url = '/api/checkUserLogin';
			return $http
					.get(url)
					.then(function(result){
						// console.log('the user from service client checkUserLogin', result);
						return result.data;
					});
		}

		function isMaker(){
			return $http
					.get('/api/isMaker')
					.then(function(result){
						return result.data;
					});
		}

		function isAdmin(){
			return $http
					.get('/api/admin/isAdmin')
					.then(function(result){
						return result.data;
					});
		}

		function setUserRole(updatedUser){
			return $http.put('/api/admin/setUserRole', updatedUser);
		}

	}
})();