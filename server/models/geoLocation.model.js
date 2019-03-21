var Sequelize = require('sequelize');
var db = require('../databse');

var GeoLocation = db.sequelize.define('geoLocation', {
    latitude: {
        type: Sequelize.STRING
    },
    longitude:{
        type: Sequelize.STRING
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

module.exports = GeoLocation;