(function() {
	angular
		.module('whatsOnJordan')
		.controller('loginController', loginController);

	function loginController(userService, $location) {

		var model = this;

		model.login = login;
		model.logout = logout;
		function init() {
			userService
					.checkUserLogin()
					.then(function(result){
						if(result){
							model.loggedUser = result;
						}
					});
		}
		init();

              

		function login(user) {
			model.error = null;
			if (!user) {
				model.error = 'Please fill the required fields';
				return;
			}else if(!user.email){
				model.error = 'Please fill the email field';
				return;
			}else if(!user.password){
				model.error = 'Please fill the password field';
				return;
			}
			userService
				.login(user.email, user.password)
				.then(
					// if sccess
					function(matchedUser){
						if(matchedUser.data === "Bad Request"){
							model.error = 'Please double check the email field';
							return;
						}else if (matchedUser.data === "Unauthorized") {
							model.error = 'Please check your email and/or password';
							return;
						} else {
							$location.url('/profile');
							return;
						}
							////////////

					},
					// if error
					function(err){
						return err;
					}
				);
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