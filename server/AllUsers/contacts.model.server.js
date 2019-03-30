var db = require('../databse');
var contactsDB = db.Contacts;  // require('../models/ageGroup.model');

db.sequelize.sync();

module.exports = contactsDB;

contactsDB.addNewContact = addNewContact;
contactsDB.getAllContacts = getAllContacts;
contactsDB.findContactByXAuthRoleId = findContactByXAuthRoleId;


function findContactByXAuthRoleId(authRoleId){
    return contactsDB.findOne({ xAuthsRoleId: authRoleId});
}

function addNewContact(authRoleId) {
    console.log('the authRoleId', authRoleId);
    
    return contactsDB
                .create()
                .then(function(createdContact){
                    createdContact.xAuthRoleId = authRoleId;
                    return createdContact.save();
                                
                })
}


function getAllContacts() {
    return contactsDB.findAll({});
}

