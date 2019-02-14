(function() {
	angular
		.module('whatsOnJordan')
		.service('userTypesService', userTypesService);

	function userTypesService($http) {

		this.getAllUserTypes = getAllUserTypes;
		
		function init() {}
		init();

		function getAllUserTypes(){
			return $http.get('/api/userTypes/getAllUserTypes');
		}

	}
})();