module.exports = function (app) {


    var categoriesDB = require('./categories.model.server');

    // ---------------------------------- APIs requests ----------------------------------

    app.get('/api/event/getAllCategories', getAllCategories);

    // ---------------------------------- /APIs requests ----------------------------------




    // ------------------------------ Functions ------------------------------

    function getAllCategories(req, res) {
        categoriesDB
            .getAllCategories()
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


