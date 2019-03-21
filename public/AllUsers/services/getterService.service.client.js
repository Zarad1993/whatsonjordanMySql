(function () {
    angular
        .module('whatsOnJordan')
        // .service('categoriesService', categoriesService);
        .service('getterService', getterService);

    function getterService($http) {
        this.getAllCategories = getAllCategories;
        this.getAllSubCategories = getAllSubCategories;
        this.getAllAgeGroups = getAllAgeGroups;
        this.getAllGrades = getAllGrades;
        this.getAllExpenseTypes = getAllExpenseTypes;


        function init() { }
        init();


        function getAllCategories() {
            return $http.get('/api/getterService/getAllCategories');
        }

        function getAllSubCategories() {
            return $http.get('/api/getterService/getAllSubCategories');
        }

        function getAllAgeGroups() {
            return $http.get('/api/getterService/getAllAgeGroups');
        }

        function getAllGrades() {
            return $http.get('/api/getterService/getAllGrades');
        }

        function getAllExpenseTypes(){
            return $http.get('/api/getterService/getAllExpenseTypes');
        }




    }

})();