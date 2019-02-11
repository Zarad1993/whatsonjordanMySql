(function () {
    angular
        .module('whatsOnJordan')
        .service('schoolsService', schoolsService);

    function schoolsService($http) {
        this.getAllSchools = getAllSchools;


        function init() { }
        init();


        function getAllSchools() {
            return $http.get('/api/school/getAllSchools');
        }
    }

})();