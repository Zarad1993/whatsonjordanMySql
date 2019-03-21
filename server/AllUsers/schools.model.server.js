var db = require('../databse');
var schoolsDB = db.School; //require('../models/school.model');

db.sequelize.sync();

module.exports = schoolsDB;

schoolsDB.addNewSchool = addNewSchool;
schoolsDB.findSchoolBySchoolId = findSchoolBySchoolId;
schoolsDB.getAllSchools = getAllSchools;

function addNewSchool(id) {
    return schoolsDB
        .create()
        .then(function (newSchool) {
            return newSchool.save();
        })
}

function findSchoolBySchoolId(schoolId) {
    return schoolsDB
        .findOne({ schoolId: schoolId })
        .then(function (foundSchool) {
            // console.log('foundMember is: ', foundMember);
            return foundSchool.get({plain:true});
        })
}

function getAllSchools() {
    return schoolsDB
        .findAll()
        .then(function (foundSchools) {
            return foundSchools;
        })
}