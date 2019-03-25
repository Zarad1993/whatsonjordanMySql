var db = require('../databse');
var contactsDB = db.Contacts;  // require('../models/ageGroup.model');

db.sequelize.sync();

module.exports = contactsDB;

contactsDB.addNewContact = addNewContact;
contactsDB.getAllContacts = getAllContacts;


function addNewContact() {
    return contactsDB.create();
}


function getAllContacts() {
    return contactsDB.findAll({});
}

