module.exports = function (app) {


    var subCategoriesDB = require('./subCategories.model.server');

    // ---------------------------------- APIs requests ----------------------------------

    app.get('/api/event/getAllSubCategories', getAllSubCategories);

    // ---------------------------------- /APIs requests ----------------------------------




    // ------------------------------ Functions ------------------------------

    function getAllSubCategories(req, res) {
        subCategoriesDB
            .getAllSubCategories()
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


