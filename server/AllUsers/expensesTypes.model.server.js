var db = require('../databse');
var expenseTypeDB = db.ExpenseType; // require('../models/expenseType.model');

db.sequelize.sync();

module.exports = expenseTypeDB;

expenseTypeDB.getAllExpenseTypes = getAllExpenseTypes;
expenseTypeDB.addNewexpenseType = addNewexpenseType;
expenseTypeDB.findExpenseTypeById = findExpenseTypeById;

function addNewexpenseType(){
    return expenseTypeDB
                .create()
        .then(function (newExpenseType){
            return newExpenseType.save();
        })
}

function findExpenseTypeById(expenseTypId){
    return expenseTypeDB
        .findOne({ id: expenseTypId})
        .then(function(foundExpenseType){
            return foundExpenseType.get();
        })
}

function getAllExpenseTypes(){
    return expenseTypeDB
                .findAll(
                    {attributes: { exclude: ['createdAt', 'updatedAt'] }}
                    )
                .then(function(foundGrades){
                    return foundGrades;
                })
}