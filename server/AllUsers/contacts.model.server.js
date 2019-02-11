var db = require('../databse');
var contactsDB = require('../models/contact.model');

db.sync();

module.exports = contactsDB;

contactsDB.updateContactsDetails = updateContactsDetails

function updateContactsDetails(contact) {
    return contactsDB
        .findById(contact.id)
        .then(function (foundContact) {
            foundContact
                .update(contact)
                .then(function (updatedContact) {
                    return updatedContact;
                })
        })
}