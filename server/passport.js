// expose this function to our app using module.exports
module.exports = function(passport) {

    // load all the things we need
    var usersDB             = require('./AllUsers/users.model.server.js');

    // passport.use('localMaker', new LocalStrategy(makerStrategy));
    // passport.use('localUser', new LocalStrategy(userStrategy));

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);


    // used to serialize the user for the session
    function serializeUser(user, done) {
        console.log('serialize step 6');
        done(null, user);
    }

    // used to deserialize the user
    function deserializeUser(user, done) {
        console.log('deserializeUser', user);
        // console.log(user);
            usersDB
                .findUserById(user.id)
                .then(
                    function(response){
                        console.log('the response from the deserialize: ' ,response);
                        done(null, response);
                    },
                    function(err){
                        done(err, null);
                    }
                );
            
        }
};
