var db = require('../databse');
var phonesDB = db.Phone;

db.sequelize.sync();

module.exports = phonesDB;


phonesDB.updatePhones = updatePhones;



function updatePhones(phones){
    console.log('the phones are: ', phones);
    // console.log('the phones Enum:', phonesDB.rawAttributes.type.values);
    return phones;
    // return contactsDB.update(contact, {where:{id: contact.id}});
    
}