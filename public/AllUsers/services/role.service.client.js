(function() {
	angular
		.module('whatsOnJordan')
		.service('roleService', roleService);

	function roleService($http) {

		this.getAllRoles = getAllRoles;
		
		function init() {}
		init();

		function getAllRoles(){
			return $http.get('/api/roles/getAllRoles');
		}

	}
})();