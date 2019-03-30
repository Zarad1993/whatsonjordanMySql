(function() {
	angular
		.module('whatsOnJordan')
		.controller('loginController', loginController);

	function loginController(authService, $location) {

		var model = this;

		model.login = login;
		model.logout = logout;
		model.loginAs = loginAs;

		
		model.authRoles = [];
		function init() {
			authService
					.checkAuthLogin()
					.then(function(result){
						// console.log('from login controller', result);
						if(result.data){
							model.loggedAuth = result.data;
							selectRole();
						}else{
							return;
						}
					});
		}
		init();

              

		function login(auth) {
			model.error = null;
			if (!auth) {
				model.error = 'Please fill the required fields';
				return;
			}else if(!auth.email){
				model.error = 'Please fill the email field';
				return;
			}else if(!auth.password){
				model.error = 'Please fill the password field';
				return;
			}
			authService
				.login(auth.email, auth.password)
				.then(
					// if sccess
					function(matchedAuth){
						console.log('the matchedAuth: ', matchedAuth);
						if(matchedAuth === "Bad Request"){
							model.error = 'Please double check the email field';
							return;
						}else if (matchedAuth === "Unauthorized") {
							model.error = 'Please check your email and/or password';
							return;
						} else {
							model.loggedAuth = matchedAuth;
							selectRole();
							return;
							// if (matchedAuth.roles.length > 1){
							// 	for (var i in matchedAuth.roles){
							// 		if (matchedAuth.roles[i].x_auth_role.active){
							// 			model.authRoles.push(matchedAuth.roles[i]);
							// 		}
							// 	}
							// 	console.log('available roles: ', model.authRoles);
							// 	if(model.authRoles.length > 1){
							// 		// model.selectRole = true;
							// 		$(function () {
							// 			$('#chooseRoleModal').modal('show');
							// 		});
							// 	}else{
							// 		$location.url('/profile');
							// 	}
							// }else{
							// 	$location.url('/profile');
							// }
							// return;
						}
							////////////

					},
					// if error
					function(err){
						return err;
					}
				);
		}

		function selectRole(){
			if (model.loggedAuth.roles.length > 1) {
				for (var i in model.loggedAuth.roles) {
					if (model.loggedAuth.roles[i].x_auth_role.active) {
						model.authRoles.push(model.loggedAuth.roles[i]);
					}
				}
				console.log('available roles: ', model.authRoles);
				if (model.authRoles.length > 1) {
					// model.selectRole = true;
					$(function () {
						$('#chooseRoleModal').modal('show');
					});
					return;
				} else {
					$location.url('/profile');
					return;
				}
			} else {
				$location.url('/profile');
				return;
			}
		}

		function loginAs(selectedRole){
			console.log('the selected role is: ', selectedRole);
			authService
				.loginAs(selectedRole)
				.then(function(updatedAuth){
					console.log('the updated auth', updatedAuth);
					// $(function () {
					// 	$('#chooseRoleModal').modal('hide');
					// });
					$location.url('/profile');
					// authService
					// 	.checkAuthLogin()
					// 	.then(function (result) {
					// 		// console.log('from login controller', result);
					// 		if (result.data) {
					// 			model.loggedAuth = result.data;
					// 			console.log('the logged auth', model.loggedAuth);
					// 			// $location.url('/profile');
					// 		} else {
					// 			return;
					// 		}
					// 	});
				});
			// $location.url('/profile', selectedRole);
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