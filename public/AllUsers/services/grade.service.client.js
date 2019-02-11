(function() {
	angular
		.module('whatsOnJordan')
		.service('gradesService', gradesService);

    function gradesService($http) {
		this.getAllGrades = getAllGrades;
		

		function init() {}
		init();

		
		function getAllGrades(){
            return $http.get('/api/grade/getAllGrades');
        }
    }

})();