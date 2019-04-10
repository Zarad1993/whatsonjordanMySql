var db = require('../databse');
var contactsDB = db.Contact;  // require('../models/ageGroup.model');
var Phone = db.Phone;
var phonesDB = require('../AllUsers/phones.model.server');

db.sequelize.sync();

module.exports = contactsDB;

contactsDB.addNewContact = addNewContact;
contactsDB.findContactsByAuthId = findContactsByAuthId;
contactsDB.updateContact = updateContact;



function addNewContact(authId, roleName) {
    console.log('the authId: ', authId);
    
    if(roleName && roleName=='Organizer'){
        return contactsDB
            .create({ type: 'Organization', authId: authId} );
            // .then(function(addedContact){
            //     return addedContact.createPhone({contactId: addedContact.id});
            // });
    }else{
        return contactsDB
                .create({authId: authId});
                // .then(function(addedContact){
                //     return addedContact.createPhone({contactId: addedContact.id});
                // })
    }
    
}

function findContactsByAuthId(authId){
    // console.log(Phone.rawAttributes.type.values);
    // will log the value of the enum
    return contactsDB.findAll({
        where: {authId: authId},
        include: [Phone]
    })
}

function updateContact(contact, phone){
    // console.log('the phones are: ', phone);
    // return contactsDB.update(contact, {where:{id: contact.id}});
    return contactsDB
                .findById(contact.id)
                .then(function(foundContact){
                    return foundContact.
                                update(contact)
                                    .then(function(updatedContact){
                                        return phonesDB
                                            .updatePhones(phone, contact.id)
                                            .then(function(updatedPhones){
                                                return updatedContact;
                                            })
                                    })
                })
}