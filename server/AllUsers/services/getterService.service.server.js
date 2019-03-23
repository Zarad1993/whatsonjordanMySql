module.exports = function (app) {


    var categoriesDB = require('../categories.model.server');
    var subCategoriesDB = require('../subCategories.model.server');
    var ageGroupsDB = require('../ageGroups.model.server');
    var gradesDB = require('../grades.model.server');
    var expenseTypesDB = require('../expensesTypes.model.server');

    // ---------------------------------- APIs requests ----------------------------------
    
    app.get('/api/getterService/getAllCategories', getAllCategories);
    app.get('/api/getterService/getAllSubCategories', getAllSubCategories);
    app.get('/api/getterService/getAllAgeGroups', getAllAgeGroups);
    app.get('/api/getterService/getAllGrades', getAllGrades);
    app.get('/api/getterService/getAllExpenseTypes', getAllExpenseTypes);

    // ---------------------------------- /APIs requests ----------------------------------


    // ------------------------------ Functions ------------------------------

    function getAllCategories(req, res) {
        categoriesDB
            .getAllCategories()
            .then(function (result) {
                if (result) {
                    res.send(result);
                    return;
                } else {
                    res.send('error');
                    return;
                }
            });
    }

    function getAllSubCategories(req, res) {
        subCategoriesDB
            .getAllSubCategories()
            .then(function (result) {
                if (result) {
                    res.send(result);
                    return;
                } else {
                    res.send('error');
                    return;
                }
            });
    }

    function getAllAgeGroups(req, res) {
        ageGroupsDB
            .getAllAgeGroups()
            .then(function (result) {
                if (result) {
                    res.send(result);
                    return;
                } else {
                    res.send('error');
                    return;
                }
            });
    }

    function getAllGrades(req, res) {
        console.log('sombody call getAllGrades');
        gradesDB
            .getAllGrades()
            .then(function (result) {
                if (result) {
                    res.send(result);
                    return;
                } else {
                    res.send('error');
                    return;
                }
            });
    }

    function getAllExpenseTypes(req, res){
        expenseTypesDB
            .getAllExpenseTypes()
            .then(function(result){
                if(result){
                    res.send(result);
                    return;
                }else{
                    res.send('err');
                    return;
                }
            })
    }



};


