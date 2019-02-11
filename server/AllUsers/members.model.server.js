var db = require('../databse');
var membersDB = require('../models/member.model');
var usersDB = require('./users.model.server');
var addressesDB = require('./addresses.model.server');
var contactsDB = require('./contacts.model.server');

var Contacts = require('../models/contact.model');
db.sync();

module.exports = membersDB;

membersDB.addNewMember = addNewMember;
membersDB.findMemberById = findMemberById;
membersDB.updateMemberDetails = updateMemberDetails;

function addNewMember(id){
    return membersDB
                .create()
                .then(function(addedMember){
                    // addedMember.setUser(id);
                    return addedMember.save();
                })
}

function findMemberById(memberId){
    return membersDB
        .findOne({where: {id: memberId}, includ: [{model: Contacts}]})
        .then(function(foundMember){
            // console.log('foundMember is: ', foundMember);
            return foundMember.dataValues;
        })
}

function updateMemberDetails(id, member){
    return membersDB
                .findById(id)
                .then(function(foundMember){
                    return foundMember
                                .update(member)
                                // .then(function(updatedMember){
                                //     console.log('the updated member in membersDB', updatedMember);
                                //     return updatedMember;
                                // })
                                .then(function(){
                                    addressesDB
                                        .updateAddressDetails(member.address)
                                        .then(function(updatedAddress){
                                            console.log('the updated Address: ', updatedAddress);
                                        });
                                })
                                .then(function(){
                                    contactsDB
                                        .updateContactsDetails(member.contact)
                                        .then(function(updatedContact){
                                            console.log('the updated contact details: ', updatedContact);
                                        });
                                });
                        })
                // .then(function (updatedMember){
                //     console.log('the updated member in membersDB', updatedMember);
                //     return membersDB
                //                 .findById(updatedMember.id)
                //                 .then(function(result){
                //                     return result;
                //                 });
                // })
}