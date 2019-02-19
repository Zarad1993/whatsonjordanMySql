(function () {
    angular
        .module('whatsOnJordan')
        .service('categoriesService', categoriesService);

    function categoriesService($http) {
        this.getAllCategories = getAllCategories;


        function init() { }
        init();


        function getAllCategories() {
            return $http.get('/api/event/getAllCategories');
        }
    }

})();