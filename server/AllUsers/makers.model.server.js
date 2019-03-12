var db = require('../databse');
var makersDB = require('../models/maker.model');
// var Contact = require('../models/contact.model');
// var Address = require('../models/address.model');
var addressesDB = require('./addresses.model.server');
var contactsDB = require('./contacts.model.server');
db.sync();

module.exports = makersDB;

makersDB.addNewMaker = addNewMaker;
makersDB.updateMakerProfile = updateMakerProfile;
makersDB.getAllMakers = getAllMakers;


function updateMakerProfile(maker){
    var makerId = maker.id;
    return makersDB
            .findById(makerId)
            .then(function(foundMaker){
                if(maker.address){
                    return addressesDB
                        .updateAddressDetails(maker.address)
                        .then(function(updatedAddress){
                            var addressId = updatedAddress.id;
                            return foundMaker
                                    .setAddress(addressId)
                                    .then(function(freshMaker){
                                        maker.addressId = addressId;
                                        return freshMaker.save();
                                    })
                        })
                }else{
                    return foundMaker;
                }
            })
            .then(function(foundMaker){
                if(maker.contact){
                    return contactsDB
                            .updateContactsDetails(maker.contact)
                            .then(function(updatedContact){
                                var contactId = updatedContact.id;
                                return foundMaker
                                        .setContact(contactId)
                                        .then(function(freshMaker){
                                            maker.contactId = contactId;
                                            return freshMaker.save();
                                        })
                            })
                }else{
                    return foundMaker;
                }
            })
            .then(function(foundMaker){
                return foundMaker.update(maker);
            })
}

function addNewMaker() {
    return makersDB.create()
        // .then(function (addedMaker) {
        //     addedMaker.setUser(maker.id);
        //     return addedMaker.save();
        // })
}

function getAllMakers(){
    return makersDB.findAll();
}