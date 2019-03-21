var db = require('../sequelize/models/index');
// console.log('the db object:', Object.keys(db));
var contactsDB = db.contact;//require('../models/contact.model');

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
            foundContact
        })
}