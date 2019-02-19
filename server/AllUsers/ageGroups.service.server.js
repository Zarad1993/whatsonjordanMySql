module.exports = function (app) {


    var ageGroupsDB = require('./ageGroups.model.server');

    // ---------------------------------- APIs requests ----------------------------------

    app.get('/api/event/getAllAgeGroups', getAllAgeGroups);

    // ---------------------------------- /APIs requests ----------------------------------




    // ------------------------------ Functions ------------------------------

    function getAllAgeGroups(req, res) {
        ageGroupsDB
            .getAllAgeGroups()
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


