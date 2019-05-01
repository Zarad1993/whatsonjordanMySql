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

			.when('/allEvents/:organizerId', {
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
					loggedMember: checkAuthRole
				}
			})

			
			.when('/MemberProfile', {
				templateUrl: 'AllUsers/templates/memberProfile.view.client.html',
				controller: 'memberProfileController',
				controllerAs: 'model',
				resolve: {
					loggedMember: isMember
				}
			})
			
			.when('/updateMemberProfile', {
				templateUrl:'AllUsers/templates/updateMemberProfile.view.client.html',
				controller: 'updateMemberProfile',
				controllerAs: 'model',
				resolve:{
						loggedMember: isMember
				}
			})

			.when('/OrganizerProfile', {
				templateUrl: 'AllUsers/templates/organizerProfile.view.client.html',
				controller: 'organizerProfileController',
				controllerAs: 'model',
				resolve: {
					loggedOrganizer: isOrganizer
				}
			})

			.when('/updateOrganizerProfile', {
				templateUrl:'AllUsers/templates/updateOrganizerProfile.view.client.html',
				controller: 'organizerProfileController',
				controllerAs: 'model',
				resolve:{
					loggedOrganizer: isOrganizer
				}
			})


			.when('/AdminProfile', {
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


			.when('/organizerProfile/eventsList', {
				templateUrl:  'AllUsers/templates/organizerEventsList.view.client.html',
				controller:   'organizerEventsListController',
				controllerAs: 'model',
				resolve: {
					loggedOrganizer: isOrganizer
				}
			})


			.when('/organizerProfile/newEvent', {
				templateUrl: 'AllUsers/templates/organizerNewEvent.view.client.html',
				controller: 'organizerNewEventController',
				controllerAs: 'model',
				resolve: {
					loggedOrganizer: isOrganizer
				}
			})

			.when('/organizerProfile/reNewEvent/:eventId', {
				templateUrl: 'AllUsers/templates/organizerReNewEvent.view.client.html',
				controller: 'organizerReNewEventController',
				controllerAs: 'model',
				resolve: {
					loggedOrganizer: isOrganizer
				}
			})

			.when('/organizerProfile/editEvent', {
				templateUrl: 'AllUsers/templates/organizerEditEvent.view.client.html',
				controller: 'organizerEditEventController',
				controllerAs: 'model',
				resolve: {
					loggedOrganizer: isOrganizer
				}
			})

			.when('/organizerProfile/organizerEventDetails/:eventId', {
				templateUrl: 'events/templates/organizerEventDetails.view.client.html',
				controller: 'organizerEventDetails',
				controllerAs: 'model',
				resolve: {
					loggedOrganizer: isOrganizer
				}
			})

			.when('/contact', {
				templateUrl: '../views/pages/contact.view.client.html',
				controller: 'homePageController',
				controllerAs: 'model'
			})
			.when('/about', {
				templateUrl: '../views/pages/about.view.client.html',
				controller: 'homePageController',
				controllerAs: 'model'
			})
			.otherwise({redirectTo: '/'});
	}
	
	// check the user if still logged in through the server cockies if the user logged in he is in the cockies based on that we can protect the url
	function isMember(authService, $q, $location){
		var deferred = $q.defer();
		authService
			.checkAuthLogin()
			.then(function(user){
				if(user === null){
					deferred.reject();
					$location.url('/login');
				} else if (user.roles.length == 1 && user.roles[0].name == "Member"){
					user.roles[0].email = user.email;
					console.log('the member details: ', user.roles[0]);
					deferred.resolve({chosenRole: user.roles[0], allRoles: user});
				} else if(user.chosenRole == 'Member'){
					console.log('the user details all: ', user);
					for(var i in user.roles){
						if(user.roles[i].name == user.chosenRole){
							user.roles[i].email = user.email;
							console.log('the chosen role on config: ', user.roles[i]);
							deferred.resolve({ chosenRole: user.roles[i], allRoles: user });
						}
					}
				}
			});
		return deferred.promise;
	}

	function isOrganizer(authService, $q, $location){
		var deferred = $q.defer();
		authService
			.checkAuthLogin()
			.then(function(auth){
				if(auth === null){
					deferred.reject();
					$location.url('/login');
				} else if(auth.chosenRole == 'Organizer'){
					for (var i in auth.roles) {
						if (auth.roles[i].name == auth.chosenRole) {
							auth.roles[i].email = auth.email;
							console.log('the chosen role on config: ', auth.roles[i]);
							deferred.resolve({chosenRole: auth.roles[i], allRoles: auth});
						}
					}
				}else{
					deferred.reject();
					$location.url('/login');
				}
			});
		return deferred.promise;
	}

	function isAdmin(authService, $q, $location){
		var deferred = $q.defer();
		authService
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


	function checkAuthRole(authService, $q, $location){
		var deferred = $q.defer();
		authService
			.checkAuthLogin()
			.then(function(result){
				var user = result;
				console.log('the result of check user login', user);
				if(user){
					if (user.roles.length > 1){
						var route1 = '/' + user.chosenRole + 'Profile';
						$location.url(route1);
					}else{
						var route2 = '/' + user.roles[0].name + 'Profile';
						$location.url(route2);
					}
				}else{
					$location.url('/login');
				}
			});
	}

})();