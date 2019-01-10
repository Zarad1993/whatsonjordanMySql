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
require('./server/databse.js');


require('./server/passport.js')(passport);


app.listen(port, function() {
	console.log('jordan events connected to: '+port);
});
