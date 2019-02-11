module.exports = function (app) {


    var schoolsDB = require('./schools.model.server');



    // ---------------------------------- APIs requests ----------------------------------

    app.get('/api/school/getAllSchools', getAllSchools);


    // ---------------------------------- /APIs requests ----------------------------------




    // ------------------------------ Functions ------------------------------



    function getAllSchools(req, res) {
        console.log('sombody call getAllSchools');
        schoolsDB
            .getAllSchools()
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


