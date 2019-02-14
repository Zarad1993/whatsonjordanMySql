module.exports = function(app) {


var userTypesDB 		= require('./userTypes.model.server.js');

// ---------------------------------- APIs requests ----------------------------------

app.get('/api/userTypes/getAllUserTypes', getAllUserTypes);

// ---------------------------------- /APIs requests ----------------------------------

	


// ------------------------------ Functions ------------------------------


	function getAllUserTypes(req, res){
		userTypesDB
			.getAllUserTypes()
			.then(function(userTypes){
				if(userTypes){
					res.send(userTypes);
					return;
				}else{
					res.send('error');
					return;
				}
			});
	}

};


