module.exports = function(app) {


var gradesDB 		= require('../grades.model.server');



// ---------------------------------- APIs requests ----------------------------------

app.get('/api/grade/getAllGrades', getAllGrades);


// ---------------------------------- /APIs requests ----------------------------------

	


// ------------------------------ Functions ------------------------------



function getAllGrades(req, res) {
    console.log('sombody call getAllGrades');
    gradesDB
		.getAllGrades()
		.then(function(result){
			if(result){
				res.send(result);
				return;
			} else {
				res.send('error');
				return;
			}
		});
}



};


