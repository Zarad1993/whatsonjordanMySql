module.exports = function (app) {


    var categoriesDB = require('../categories.model.server');
    var subCategoriesDB = require('../subCategories.model.server');
    var ageGroupsDB = require('../ageGroups.model.server');
    var gradesDB = require('../grades.model.server');
    var expenseTypesDB = require('../expensesTypes.model.server');
    var Phone = require('../../models/phones.model');
    var addressesDB = require('../addresses.model.server');
    var schoolsDB = require('../schools.model.server');
    var nationalitiesDB = require('../nationalities.model.server');

    // ---------------------------------- APIs requests ----------------------------------
    
    app.get('/api/getterService/getEventHelpers/:organizerId', getEventHelpers);
    app.get('/api/getterService/getMemberProfileHelpers', getMemberProfileHelpers);
    app.get('/api/getterService/getAllCategories', getAllCategories);
    app.get('/api/getterService/getAllSubCategories', getAllSubCategories);
    app.get('/api/getterService/getAllAgeGroups', getAllAgeGroups);
    app.get('/api/getterService/getAllGrades', getAllGrades);
    app.get('/api/getterService/getAllExpenseTypes', getAllExpenseTypes);
    app.get('/api/getterService/getPhoneTypes', getPhoneTypes);

    // ---------------------------------- /APIs requests ----------------------------------


    // ------------------------------ Functions ------------------------------

    // functions that will bring data:
    var categories= categoriesDB.getAllCategories();
    var subCategories= subCategoriesDB.getAllSubCategories();
    var ageGroups = ageGroupsDB.getAllAgeGroups();
    var phoneTypes = {phoneTypes: Phone.rawAttributes.type.values};
    var allGrades = gradesDB.getAllGrades();
    var allSchools = schoolsDB.getAllSchools();
    var nationalities = nationalitiesDB.getAllNationalities();
    
    
    function getEventHelpers(req, res){
        var organizerId = req.params.organizerId;
        var addresses = addressesDB.getOrganizerAddresses(organizerId);
        
        var functions = [categories, subCategories, ageGroups, addresses];
        
        var allResults = [];
        
        return Promise
                .all(functions)
                .then(function(results){
                    results.forEach(function(result){
                        allResults.push(result);
                    });
                    console.log('the promise result: ', allResults);
                    res.send(allResults);
                    return;
                });
    }

    function getMemberProfileHelpers(req, res){
        var functions = [phoneTypes, allGrades, allSchools, nationalities];

        var allResults = [];

        return Promise
            .all(functions)
            .then(function (results) {
                results.forEach(function (result) {
                    allResults.push(result);
                });
                console.log('the promise result: ', allResults);
                res.send(allResults);
                return;
            });
    }


    function getAllCategories(req, res) {
        categoriesDB
            .getAllCategories()
            .then(function (result) {
                if (result) {
                    res.send(result);
                    return result;
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
                    return result;
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

    function getPhoneTypes(req, res){
        console.log('the phones Enum:', Phone.rawAttributes.type.values);
        res.send(Phone.rawAttributes.type.values);
    }



};


