var express 	 = require('express');
var volleyball = require('volleyball');
var app 		 = express();
var bodyParser 	 = require('body-parser');

// security
var passport     = require('passport');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var port = process.env.PORT || 8080;

// to add secret variables to the process.env through the .env file which it ignored from gitting to github
require('dotenv').config();

app.use(express.static(__dirname + '/public'));

// to logg req and res
app.use(volleyball);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
	

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());


require('./server/AllUsers/users.service.server')(app);
require('./server/events/event.service.server')(app);
require('./server/AllUsers/grades.service.server')(app);
require('./server/AllUsers/schools.service.server')(app);
require('./server/AllUsers/nationalities.service.server')(app);
require('./server/AllUsers/userTypes.service.server')(app);
require('./server/AllUsers/categories.service.server')(app);
require('./server/AllUsers/ageGroups.service.server')(app);
require('./server/AllUsers/subCategories.service.server')(app);
require('./server/AllUsers/address.service.server')(app);
// require('./server/databse.js');
// using the sequelize-cli
var db = require('./server/sequelize/models');


require('./server/passport.js')(passport);


app.listen(port, function() {
    // console.log('the database:',Object.keys(db));
    db
        .sequelize.authenticate()
        .then(function () {
            db.sequelize.sync();
            console.log('Connected successfully');
        })
        .catch(function (err) {
            console.error('Unable to connect to DB', err);
        });

    console.log('jordan events connected to: '+port);
});
