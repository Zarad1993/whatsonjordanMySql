(function () {
    angular
        .module('whatsOnJordan')
        .service('nationalitiesService', nationalitiesService);

    function nationalitiesService($http) {
        this.getAllNationalities = getAllNationalities;


        function init() { }
        init();


        function getAllNationalities() {
            return $http.get('/api/nationality/getAllNationalities');
        }
    }

})();