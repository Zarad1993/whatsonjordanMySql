var db = require('../databse');
var geoLocationDB = require('../models/geoLocation.model');

db.sync();

module.exports = geoLocationDB;

geoLocationDB.getAllLocations = getAllLocations;
geoLocationDB.addEventLocation = addEventLocation;
geoLocationDB.updateGeoLocation = updateGeoLocation;

function getAllLocations() {
    return geoLocationDB
        .findAll({})
        // .then(function (allCategories) {
        //     return allCategories.map(function (category) { return category.get({ plain: true }) });;
        // })
}

function addEventLocation(location){
    console.log('the geolocation on geolocation model', location);
    return geoLocationDB
            .create(location);
}

function updateGeoLocation(updatedLocation) {
    if (updatedLocation.id) {
        return geoLocationDB
            .findById(updatedLocation.id)
            .then(function (foundLocation) {
                return foundLocation.update(updatedLocation);
            });
    } else {
        return geoLocationDB.create(updatedLocation);
    }
}