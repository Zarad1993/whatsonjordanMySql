var db = require('../databse');
var addressesDB = db.Address; // require('../models/address.model');

db.sequelize.sync();

module.exports = addressesDB;

addressesDB.updateAddressDetails = updateAddressDetails;
addressesDB.createAddress = createAddress;
addressesDB.getOrganizerAddresses = getOrganizerAddresses;

addressesDB.updateOrCreateAddress = updateOrCreateAddress;

function updateOrCreateAddress(addresses, contactId, contactType){
    // if (contactType == 'Individual'){
    //     var address = addresses[0];
    //     // address.active = true;
    //     address.contactId = contactId;        
    //     return addressesDB
    //             .findOrCreate({
    //                 where: {contactId: contactId},
    //                 defaults: address
    //             })
    //             .then(function(result){
    //                 // if find an address update it
    //                 if(!result[1]){
    //                     result[0]
    //                         .update(address)
    //                         .then(function(updatedAddress) {
    //                             console.log('the updated Address: ',  updatedAddress);
    //                             return updatedAddress;             
    //                         });
    //                 }else{
    //                     // the created Address
    //                     return result[1];
    //                 }
    //             });
    // }else{
        return Promise.all(addresses.map(function(address){
            if(address.id){
                return addressesDB.update(address, {where:{id:address.id}});
            }else{
                address.contactId = contactId;
                return addressesDB.create(address);
            }
        })).then(function(result){
            return result;
        });
    // }
}


function updateAddressDetails(address) {
    // console.log('the address from the addressdb: ', address);
    if(address.id){
        return addressesDB
            .findById(address.id)
            .then(function (foundAddress) {
                    return foundAddress.update(address);
            });
    }else{
        return addressesDB.create(address);
    }
}

function createAddress(address){
    return addressesDB.create(address);
}

function getOrganizerAddresses(organizerId){
    // var maker = 'Maker' + organizerId;
    return addressesDB
        .findAll({
            where: {contactId: organizerId},
            include: [{all: true}],
            raw: true
        })
        .then(function(addresses){           
            var allAddresses = { allAddresses: addresses };
            return allAddresses;
        })
}