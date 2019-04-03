var db = require('../databse');
var phonesDB = db.Phone; // require('../models/phone.model');

db.sequelize.sync();

module.exports = phonesDB;

phonesDB.updatePhoneDetails = updatePhoneDetails

function updatePhoneDetails(phone) {
    return phonesDB
        .findById(phone.id)
        .then(function (foundphone) {
            console.log('the found phone: ', foundphone);
            if(foundphone){
                return foundphone
                    .update(phone)
                    // .then(function (updatedphone) {
                    //     return updatedphone;
                    // })
            }else{
                return phonesDB
                    .create(phone)
                    // .then(function(ctratedphone){
                    //     console.log('the created phone', ctratedphone);
                    // })
            }
        });
}