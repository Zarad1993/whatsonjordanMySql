module.exports = function (app) {


    var addressesDB = require('../addresses.model.server');


    // ---------------------------------- APIs requests ----------------------------------

    app.get('/api/address/getOrganizerAddresses/:organizerId', getOrganizerAddresses);

    // ---------------------------------- /APIs requests ----------------------------------



    // ------------------------------ Functions ------------------------------

    function getOrganizerAddresses(req, res) {
        var organizerId = req.params.organizerId;
        addressesDB
            .getOrganizerAddresses(organizerId)
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

    

};


