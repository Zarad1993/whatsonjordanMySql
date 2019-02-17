var db = require('../databse');
var addressesDB = require('../models/address.model');

db.sync();

module.exports = addressesDB;

addressesDB.updateAddressDetails = updateAddressDetails;

function updateAddressDetails(address) {
    console.log('the address from the addressdb: ', address);
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