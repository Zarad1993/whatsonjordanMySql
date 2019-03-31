(function() {
	angular
		.module('whatsOnJordan')
		.controller('registerController', registerController);

	function registerController(authService, $location, $rootScope) {
		var model = this;

		function init() {
			authService
					.checkAuthLogin()
					.then(function(auth){
						if(auth){
							model.loggedUser = auth;
						}
					});
		}
		init();
		model.register = register;
		model.logout = logout;

		function logout(){
			authService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}



		function register(auth, password2) {
			if(!auth) {
				model.error = 'Please fill all the requested fields';
				return;
			}
			if(auth.password === password2) {
				model.error = null;
				return authService
					.createAuth(auth)
					.then(function(createdAuth){
						console.log('the created auth: ', createdAuth);
						if (createdAuth.data.errors > 0) {
							if (createdAuth.data.errors[0].message == 'email must be unique'){
								model.error = 'Email already exist';
							}
						}else{						
							$location.url('/profile');
						}
					});
			} else {
				model.error = 'Please double check that the two passwords are matched';
			}
		}
	}
})();