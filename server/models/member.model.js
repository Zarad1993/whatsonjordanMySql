var Sequelize = require('sequelize');
var db = require('../databse');
var Member = db.define('member', {
    firstName: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    middleName: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    lastName: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    DOB: {
        type: Sequelize.DATE,
        defaultValue: null
    },
    profileImage: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    gender: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
});

// Member.associate = function(models){
//     Member.belongsToMany(models.Event, {through: 'MemberEvent'})
// }


module.exports = Member;