// expose this function to our app using module.exports
module.exports = function(passport) {

    // load all the things we need
    var usersDB             = require('./AllUsers/users.model.server');

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
        // console.log('deserializeUser has been called');
        if(user){
            usersDB
                .getUserDetails(user.id)
                .then(
                    function(foundUser){
                    done(null, foundUser)
                    },
                    function(err){
                        done(err, null);
                    }
                );
        }else{
            done(err, null);
        }
    }
};
