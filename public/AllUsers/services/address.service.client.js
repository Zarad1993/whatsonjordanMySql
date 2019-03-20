(function () {
    angular
        .module('whatsOnJordan')
        .service('addressService', addressService);

    function addressService($http) {
        this.getMakerAddresses = getMakerAddresses;


        function init() { }
        init();

        function getMakerAddresses(makerId) {
            return $http.get('/api/address/getMakerAddresses/'+makerId);
        }

        
    }

})();