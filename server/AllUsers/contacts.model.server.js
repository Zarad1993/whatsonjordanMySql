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

function addNewContact(authRoleId, roleName) {
    console.log('the authRoleId', authRoleId);
    console.log('the role name is: ', roleName);
    if(roleName && roleName=='Organizer'){
        return contactsDB
            .create({ type: 'Organization', xAuthRoleId: authRoleId} );
            // .then(function (createdContact) {
            //     // createdContact.xAuthRoleId = authRoleId;
            //     return createdContact;

            // })
    }else{
        return contactsDB
                .create()
                .then(function(createdContact){
                    createdContact.xAuthRoleId = authRoleId;
                    return createdContact.save();                            
                })
    }
    
}


function getAllContacts() {
    return contactsDB.findAll({});
}

