var db = require('../databse');
var contactsDB = db.Contact;  // require('../models/ageGroup.model');
var x_auth_role = db.X_Auth_Role;
var auth = db.Auth;
var role = db.Role;

db.sequelize.sync();

module.exports = contactsDB;

contactsDB.addNewContact = addNewContact;
contactsDB.findContactsByAuthId = findContactsByAuthId;



function addNewContact(authId, roleName) {
    // console.log('the authRoleId', authRoleId);
    // console.log('the role name is: ', roleName);
    console.log('the authId: ', authId);
    
    if(roleName && roleName=='Organizer'){
        return contactsDB
            .create({ type: 'Organization', authId: authId} );
            // .then(function (createdContact) {
            //     // createdContact.xAuthRoleId = authRoleId;
            //     return createdContact;

            // })
    }else{
        return contactsDB
                .create({authId: authId});
                // .then(function(createdContact){
                //     createdContact.xAuthRoleId = authRoleId;
                //     return createdContact.save();                            
                // })
    }
    
}

function findContactsByAuthId(authId){
    return contactsDB.findAll({where: {authId: authId}});
}


