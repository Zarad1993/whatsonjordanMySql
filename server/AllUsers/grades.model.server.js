var db = require('../databse');
var gradesDB = db.Grade;

db.sequelize.sync();

module.exports = gradesDB;

gradesDB.addNewGrade = addNewGrade;
gradesDB.findGradeByGradeId = findGradeByGradeId;
gradesDB.getAllGrades = getAllGrades;

function addNewGrade(id){
    return gradesDB
                .create()
                .then(function(newGrade){
                    // addedMember.setUser(id);
                    return newGrade.save();
                })
}

function findGradeByGradeId(gradeId){
    return gradesDB
        .findOne({gradeId: gradeId})
        .then(function(foundGrade){
            // console.log('foundMember is: ', foundMember);
            
            // original
            //return foundGrade.dataValues;            
            return foundGrade.get({plain: true});
        })
}

function getAllGrades(){
    return gradesDB
                .findAll({ raw: true })
                .then(function(foundGrades){
                    var allGrades = { allGrades: foundGrades };
                    return allGrades;
                })
}