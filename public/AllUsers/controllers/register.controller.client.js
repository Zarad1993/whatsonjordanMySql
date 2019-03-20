(function() {
	angular
		.module('whatsOnJordan')
		.controller('registerController', registerController);

	function registerController(userService, $location, $rootScope) {
		var model = this;

		function init() {
			userService
					.checkUserLogin()
					.then(function(user){
						if(user){
							model.loggedUser = user;
						}
					});
		}
		init();
		model.register = register;
		model.logout = logout;

		function logout(){
			userService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}



		function register(user, password2) {
			// console.log(user);
			if (!user) {
				model.error = 'Please fill all the requested fields';
				return;
			}
			if (user.password === password2) {
				model.error = null;
				return userService
					.createUser(user)
					.then(function(createdUser){
						if (createdUser.data.errors > 0) {
							if (createdUser.data.errors[0].message == 'email must be unique'){
								model.error = 'Email already exist';
							}
						}else{
							$location.url('/profile');
						}
						// console.log('the return from the db', createdUser.data.errors[0].message)
						// console.log('the createdUser on controller for the created user: ', createdUser);
					});
					// .findUserByEmail(user.email)
					// .then(function(result){
					// 	if(result === 'email already exist'){
					// 		model.error = 'email already exist';
					// 		return;
					// 	}else{
					// 		return userService.createUser(user)
					// 			.then(function(result){
					// 				console.log(result);
					// 				var matchedUser = result;
					// 				var userId = matchedUser._id;
					// 				$rootScope.loggedUser = matchedUser;
					// 				// it is not going to userProfile should be by adding the login functionality here also or find another solution
					// 				if(matchedUser.userType === 'user'){
					// 					$location.url('/userProfile');
					// 					return;
					// 				}else if(matchedUser.userType === 'maker'){
					// 					$location.url('/makerProfile');
					// 					return;
					// 				}else if(matchedUser.userType === 'admin'){
					// 					$location.url('/adminPage');
					// 					return;
					// 				}else if(matchedUser.userType === 'superAdmin'){
					// 					$location.url('/superAdminProfile');
					// 					return;
					// 				}
					// 				return;
					// 			});
					// 	}
					// });


			} else {
				model.error = 'Please double check that the two passwords are matched';
			}
		}
	}
})();