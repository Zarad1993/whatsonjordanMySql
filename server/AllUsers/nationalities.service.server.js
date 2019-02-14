module.exports = function (app) {


    var nationalitiesDB = require('./nationalities.model.server');



    // ---------------------------------- APIs requests ----------------------------------

    app.get('/api/nationality/getAllNationalities', getAllNationalities);


    // ---------------------------------- /APIs requests ----------------------------------




    // ------------------------------ Functions ------------------------------

    function getAllNationalities(req, res) {
        console.log('somebody call getAllNationalities');
        nationalitiesDB
            .getAllNationalities()
            .then(function (result) {
                if (result) {
                    console.log('the nationalities are: ', result);
                    res.send(result);
                    return;
                } else {
                    res.send('error');
                    return;
                }
            });
    }



};


