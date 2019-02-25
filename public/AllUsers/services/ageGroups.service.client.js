(function () {
    angular
        .module('whatsOnJordan')
        .service('ageGroupsService', ageGroupsService);

    function ageGroupsService($http) {
        this.getAllAgeGroups = getAllAgeGroups;


        function init() { }
        init();


        function getAllAgeGroups() {
            return $http.get('/api/getAllAgeGroups');
        }
    }

})();