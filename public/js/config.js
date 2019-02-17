(function () {
	angular
		.module('whatsOnJordan')
		.config(configuration);

	function configuration($routeProvider) {
		$routeProvider
			//ok
			.when('/', {
				templateUrl: '../views/pages/home.html',
				controller: 'homePageController',
				controllerAs: 'model'
				// add a controller to use the logged user instead of $rootScope
			})
			//ok
			.when('/allEvents', {
				templateUrl: 'events/templates/allEvents.view.client.html',
				controller: 'allEventsController',
				controllerAs: 'model'
			})

			.when('/allEvents/:makerId', {
				templateUrl: 'events/templates/allEvents.view.client.html',
				controller: 'allEventsController',
				controllerAs: 'model'
			})

			.when('/login', {
				templateUrl: 'AllUsers/templates/login.view.client.html',
				controller: 'loginController',
				controllerAs: 'model'
			})
			
			.when('/register', {
				templateUrl: 'AllUsers/templates/register.view.client.html',
				controller: 'registerController',
				controllerAs: 'model'
			})

			.when('/forgetPassword', {
				templateUrl: 'AllUsers/templates/forgetPassword.view.client.html',
				controller: 'forgetPasswordController',
				controllerAs: 'model'	
			})
			.when('/resetPassword/:token', {
				templateUrl: 'AllUsers/templates/resetPassword.view.client.html',
				controller: 'resetPasswordController',
				controllerAs: 'model'	
			})

			.when('/profile', {
				resolve: {
					loggedUser: checkUserType
				}
			})
			
			.when('/userProfile', {
				templateUrl: 'AllUsers/templates/userProfile.view.client.html',
				controller: 'userProfileController',
				controllerAs: 'model',
				resolve: {
					loggedUser: isUser
				}
			})
			
			.when('/updateUserProfile', {
				templateUrl:'AllUsers/templates/updateUserProfile.view.client.html',
				controller: 'updateUserProfile',
				controllerAs: 'model',
				resolve:{
						loggedUser: isUser
				}
			})

			.when('/makerProfile', {
				templateUrl: 'AllUsers/templates/makerProfile.view.client.html',
				controller: 'makerProfileController',
				controllerAs: 'model',
				resolve: {
					loggedMaker: isMaker
				}
			})

			.when('/updateMakerProfile', {
				templateUrl:'AllUsers/templates/updateMakerProfile.view.client.html',
				controller: 'makerProfileController',
				controllerAs: 'model',
				resolve:{
					loggedMaker: isMaker
				}
			})


			.when('/adminPage', {
				templateUrl: 'admin/templates/adminPage.view.client.html',
				controller: 'adminController',
				controllerAs: 'model',
				resolve: {
					loggedAdmin: isAdmin
				}

			})
			
			.when('/eventDetails/:eventId',{
				templateUrl: 'events/templates/eventDetails.view.client.html',
				controller: 'eventDetailsController',
				controllerAs: 'model'
			})


			.when('/makerProfile/eventsList', {
				templateUrl:  'AllUsers/templates/makerEventsList.view.client.html',
				controller:   'makerEventsListController',
				controllerAs: 'model',
				resolve: {
					loggedMaker: isMaker
				}
			})


			.when('/makerProfile/newEvent', {
				templateUrl: 'AllUsers/templates/makerNewEvent.view.client.html',
				controller: 'makerNewEventController',
				controllerAs: 'model',
				resolve: {
					loggedMaker: isMaker
				}
			})

			.when('/makerProfile/reNewEvent/:eventId', {
				templateUrl: 'AllUsers/templates/makerReNewEvent.view.client.html',
				controller: 'makerReNewEventController',
				controllerAs: 'model',
				resolve: {
					loggedMaker: isMaker
				}
			})

			.when('/makerProfile/editEvent', {
				templateUrl: 'AllUsers/templates/makerEditEvent.view.client.html',
				controller: 'makerEditEventController',
				controllerAs: 'model',
				resolve: {
					loggedMaker: isMaker
				}
			})


			.when('/makerProfile/makerEventDetails/:eventId', {
				templateUrl: 'events/templates/makerEventDetails.view.client.html',
				controller: 'makerEventDetails',
				controllerAs: 'model',
				resolve: {
					loggedMaker: isMaker
				}
			})

			// .when('/admin', {
			// 	templateUrl: 'admin/templates/adminPage.view.client.html',
			// 	controller: 'adminController',
			// 	controllerAs: 'model',
			// 	resolve: {
			// 		loggedUser: checkUserLogin
			// 	}
			// })
			.when('/contact', {
				templateUrl: '../views/pages/contact.view.client.html',
				controller: 'homePageController',
				controllerAs: 'model'
			})
			.when('/about', {
				templateUrl: '../views/pages/about.view.client.html',
				controller: 'homePageController',
				controllerAs: 'model'
			});
	}
	
	// check the user if still logged in through the server cockies if the user logged in he is in the cockies based on that we can protect the url
	function isUser(userService, $q, $location){
		var deferred = $q.defer();
		userService
			.checkUserLogin()
			.then(function(user){
				if(user === null){
					deferred.reject();
					$location.url('/login');
				} else{
					console.log('from isUser in config: ', user);
					deferred.resolve(user);
				}
			});
		return deferred.promise;
	}

	function isMaker(userService, $q, $location){
		var deferred = $q.defer();
		userService
			.isMaker()
			.then(function(maker){
				if(maker === null){
					deferred.reject();
					$location.url('/login');
				} else{
					deferred.resolve(maker);
				}
			});
		return deferred.promise;
	}

	function isAdmin(userService, $q, $location){
		var deferred = $q.defer();
		userService
			.isAdmin()
			.then(function(admin){
				if(admin === null){
					deferred.reject();
					$location.url('/');
				}else{
					deferred.resolve(admin);
				}
			});
			return deferred.promise;
	}

	function checkUserType(userService, $q, $location){
		var deferred = $q.defer();
		userService
			.checkUserLogin()
			.then(function(user){
				// console.log('somebody call me..........')
				if(user.userTypeId === 1){
					deferred.resolve(user);
					$location.url('/userProfile');
					return deferred.promise;
				} else if(user.userTypeId === 2){
					deferred.resolve(user);
					$location.url('/makerProfile');
					return deferred.promise;
				}else if(user.userTypeId === 3){
					deferred.resolve(user);
					$location.url('/adminPage');
					return deferred.promise;
				}
			});
	}

})();