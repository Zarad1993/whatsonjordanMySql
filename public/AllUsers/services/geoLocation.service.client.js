(function () {
    angular
        .module('whatsOnJordan')
        .service('geoLocation', geoLocation);

    function geoLocation($http) {
        this.getAllLocations = getAllLocations;
        this.addEventLocation = addEventLocation;


        function init() { }
        init();


        function getAllLocations() {
            return $http.get('/api/event/getAllLocations');
        }

        function addEventLocation(location){
            return $http.post('/api/event/addEventLocation', location)
        }
    }

})();