var db = require('../databse');
var contactsDB = db.Contact;  // require('../models/ageGroup.model');
var Phone = db.Phone;

db.sequelize.sync();

module.exports = contactsDB;

contactsDB.addNewContact = addNewContact;
contactsDB.findContactsByAuthId = findContactsByAuthId;



function addNewContact(authId, roleName) {
    console.log('the authId: ', authId);
    
    if(roleName && roleName=='Organizer'){
        return contactsDB
            .create({ type: 'Organization', authId: authId} )
            .then(function(addedContact){
                return addedContact.createPhone({contactId: addedContact.id});
            });
    }else{
        return contactsDB
                .create({authId: authId})
                .then(function(addedContact){
                    return addedContact.createPhone({contactId: addedContact.id});
                })
    }
    
}

function findContactsByAuthId(authId){
    return contactsDB.findAll({
        where: {authId: authId},
        include: [Phone]
    });
}


