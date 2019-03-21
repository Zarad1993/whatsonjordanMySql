var db = require('../databse');
var contactsDB = db.Contact; // require('../models/contact.model');

db.sequelize.sync();

module.exports = contactsDB;

contactsDB.updateContactsDetails = updateContactsDetails

function updateContactsDetails(contact) {
    return contactsDB
        .findById(contact.id)
        .then(function (foundContact) {
            console.log('the found contact: ', foundContact);
            if(foundContact){
                return foundContact
                    .update(contact)
                    // .then(function (updatedContact) {
                    //     return updatedContact;
                    // })
            }else{
                return contactsDB
                    .create(contact)
                    // .then(function(ctratedContact){
                    //     console.log('the created contact', ctratedContact);
                    // })
            }
        });
}