(function() {
	angular
		.module('whatsOnJordan')
		.controller('resetPasswordController', resetPasswordController);

	function resetPasswordController(authService, $location, $routeParams) {
		var model = this;
		model.loggedMember = undefined;
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
				authService
					.resetPassword(token, password)
					.then(function(user){
						if(user.data.email){
							console.log('The password changed successfully...');
							model.loggedMember = user;
							$location.url('/profile');
						}else{
							model.msg = 'Please resend the password reset request; double check the email submitted is correct and reset the password within one hour from the time of send the reset password request!';
							return;
						}
					});
			}
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