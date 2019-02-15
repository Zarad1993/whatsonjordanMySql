var db = require('../databse');
var makersDB = require('../models/maker.model');
db.sync();

module.exports = makersDB;

makersDB.addNewMaker = addNewMaker;

function addNewMaker() {
    return makersDB.create()
        // .then(function (addedMaker) {
        //     addedMaker.setUser(maker.id);
        //     return addedMaker.save();
        // })
}