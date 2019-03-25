module.exports = function(app) {


var roleDB 		= require('../role.model.server.js');

// ---------------------------------- APIs requests ----------------------------------

app.get('/api/roles/getAllRoles', getAllRoles);

// ---------------------------------- /APIs requests ----------------------------------

	


// ------------------------------ Functions ------------------------------


	function getAllRoles(req, res){
		roleDB
			.getAllRoles()
			.then(function(roles){
				if(roles){
					res.send(roles);
					return;
				}else{
					res.send('error');
					return;
				}
			});
	}

};


