var db = require('../databse');
var addressesDB = require('../models/address.model');

db.sync();

module.exports = addressesDB;

addressesDB.updateAddressDetails = updateAddressDetails

function updateAddressDetails(address) {
    if(address){
        return addressesDB
            .findById(address.id)
            .then(function (foundAddress) {
                if(foundAddress){
                    return foundAddress
                                .update(address)
                }else{
                    return addressesDB
                                .create(address)
                }
                    
            })
    }
}