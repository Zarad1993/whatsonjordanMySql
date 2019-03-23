module.exports = function (app) {


    var geoLocationDB = require('../geoLocation.model.server');

    // ---------------------------------- APIs requests ----------------------------------

    app.get('/api/event/getAllLocations', getAllLocations);
    app.post('/api/event/addEventLocation', addEventLocation);

    // ---------------------------------- /APIs requests ----------------------------------




    // ------------------------------ Functions ------------------------------

    function getAllLocations(req, res) {
        geoLocationDB
            .getAllLocations()
            .then(function (result) {
                if (result) {
                    res.send(result);
                    return;
                } else {
                    res.send('error');
                    return;
                }
            });
    }

    function addEventLocation(req, res){
        var location = req.body;
        geoLocationDB
            .addEventLocation(location)
            .then(function(result){
                if (result) {
                    res.send(result);
                    return;
                } else {
                    res.send('error');
                    return;
                }
            })
    }



};


