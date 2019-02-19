(function () {
    angular
        .module('whatsOnJordan')
        .service('subCategoriesService', subCategoriesService);

    function subCategoriesService($http) {
        this.getAllSubCategories = getAllSubCategories;


        function init() { }
        init();


        function getAllSubCategories() {
            return $http.get('/api/event/getAllSubCategories');
        }
    }

})();