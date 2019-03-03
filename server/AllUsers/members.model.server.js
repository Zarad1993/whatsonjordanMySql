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
membersDB.addEventToMember = addEventToMember;
membersDB.getMemberEvents = getMemberEvents;


function addNewMember(id){
    return membersDB
                .create();
}

function findMemberById(memberId){
    return membersDB
        .findOne({where: {id: memberId}, includ: [{model: Contacts}]})
        .then(function(foundMember){
            // console.log('foundMember is: ', foundMember);
            return foundMember.get({plain: true});
        })
}

function updateMemberDetails(id, member){
    return membersDB
                .findById(id)
                .then(function(foundMember){
                    if(member.address){
                        return addressesDB
                            .updateAddressDetails(member.address)
                            .then(function (updatedAddress) {
                                var addressId = updatedAddress.id
                                return foundMember
                                    .setAddress(addressId)
                                    .then(function(freshMember){
                                        member.addressId = addressId;
                                        return freshMember.save();
                                    })
                            });
                    }else{
                        return foundMember;
                    }
                })
                .then(function(foundMember){
                    if (member.contact) {
                        return contactsDB
                            .updateContactsDetails(member.contact)
                            .then(function (updatedContact) {
                                var contactId = updatedContact.id;
                                return foundMember
                                    .setContact(contactId)
                                    .then(function(freshMember){
                                        member.contactId = contactId;
                                        return freshMember.save();
                                    });
                            });
                    }else{
                        return foundMember;
                    }
                })
                .then(function(foundMember){
                    return foundMember
                        .update(member)
                })
}


function addEventToMember(eventID, memberId){
    return membersDB
        .findById(memberId)
        .then(function(member){
            return member.addEvent(eventID)
        })
}

function getMemberEvents(memberId){
    return membersDB
                .findById(memberId)
                .then(function(member){
                    return member.getEvents({
                        include: [{all: true}],
                    });
                });
}