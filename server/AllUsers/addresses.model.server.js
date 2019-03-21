var db = require('../databse');
var addressesDB = db.Address; // require('../models/address.model');

db.sequelize.sync();

module.exports = addressesDB;

addressesDB.updateAddressDetails = updateAddressDetails;
addressesDB.createAddress = createAddress;
addressesDB.getMakerAddresses = getMakerAddresses;

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

function getMakerAddresses(makerId){
    var maker = 'Maker' + makerId;
    return addressesDB
        .findAll({
            where: {createdBy: maker},
            include: [{all: true}]
        })
}