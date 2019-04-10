var db = require('../databse');
var phonesDB = db.Phone;

db.sequelize.sync();

module.exports = phonesDB;


phonesDB.updatePhones = updatePhones;



function updatePhones(phones, contactId){
    console.log('the phones are: ', phones);
    // var totalResult = [];
    function asyncLoop(i, cb) {
        if (i < phones.length) {
            phonesDB
                .findOrCreate({ 
                    where: { contactId: contactId, type: phones[i].type }, 
                    defaults: { 
                        contactId: contactId, 
                        type: phones[i].type, 
                        number: phones[i].number
                    } 
                })
                .then(function (result) {
                    // console.log('each result: ', result[0].get({plain: true}));
                    // if found record then update it
                    if(!result[1]){
                        result[0]
                            .update(phones[i])
                            .then(function(updatedPhone){
                                // totalResult.push(result);
                                asyncLoop(i + 1, cb);
                            })
                    }else{
                        // totalResult.push(result);
                        asyncLoop(i + 1, cb);
                    }
                });
        } else {
            cb();
        }
    }
    var phonePromise = new Promise(function(resolve, reject){
        asyncLoop(0, function () {
            resolve ('Finished');
            // console.log('the result : ', totalResult);
        });
    });
    return phonePromise.then(function(result){
        return result;
    })


}