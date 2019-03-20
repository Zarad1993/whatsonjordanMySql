module.exports = function (app) {


    var addressesDB = require('./addresses.model.server');

    // ---------------------------------- APIs requests ----------------------------------

    app.get('/api/address/getMakerAddresses/:makerId', getMakerAddresses);

    // ---------------------------------- /APIs requests ----------------------------------



    // ------------------------------ Functions ------------------------------

    function getMakerAddresses(req, res) {
        var makerId = req.params.makerId;
        addressesDB
            .getMakerAddresses(makerId)
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


