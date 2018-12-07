var mongoose = require('mongoose');

var connectionString = 'mongodb://localhost/jordaneventsemifinal'; // for local

// check if running remotely
if(process.env.GOOGLE_CALLBACK_URL) { 
        var username = process.env.MLAB_USERNAME;
        var password = process.env.MLAB_PASSWORD;
        connectionString = 'mongodb://' + username + ':' + password;
        connectionString += '@ds147920.mlab.com:47920/heroku_sqjcbg63';
}

// if(process.env.MONGODB_URI) { 
//         var connectionString = process.env.MONGODB_URI;
// }

mongoose.connect(connectionString);

//mongodb://<dbuser>:<dbpassword>@ds147920.mlab.com:47920/heroku_sqjcbg63
// mongodb://heroku_sqjcbg63:n4hgr936ocahk45fmj6qfvl4co@ds147920.mlab.com:47920/heroku_sqjcbg63