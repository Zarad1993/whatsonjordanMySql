(function() {
	angular
		.module('whatsOnJordan')
		.controller('resetPasswordController', resetPasswordController);

	function resetPasswordController(userService, $location, $routeParams) {

		var model = this;
		model.loggedUser = undefined;
		model.logout = logout;
		model.resetPassword = resetPassword;
		model.msg = null;
		
		function init() {
		}
		init();


		function resetPassword (password, confirmPassword){
			var token = $routeParams.token;
			if(password !== confirmPassword){
				model.msg = 'Password shoud be the same as confirm password!';
				return;
			} else{
				userService
					.resetPassword(token, password)
					.then(function(user){
						model.loggedUser = user;
						$location.url('/profile');
					});
			}
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