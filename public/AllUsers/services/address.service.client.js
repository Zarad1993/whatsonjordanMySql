(function () {
    angular
        .module('whatsOnJordan')
        .service('addressService', addressService);

    function addressService($http) {
        this.getOrganizerAddresses = getOrganizerAddresses;


        function init() { }
        init();

        function getOrganizerAddresses(organizerId) {
            return $http.get('/api/address/getOrganizerAddresses/'+organizerId);
        }

        
    }

})();