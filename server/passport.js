// expose this function to our app using module.exports
module.exports = function(passport) {

    // load all the things we need
    var authDB = require('./AllUsers/auth.model.server');

    // passport.use('localMaker', new LocalStrategy(makerStrategy));
    // passport.use('localUser', new LocalStrategy(userStrategy));

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    // used to serialize the user for the session
    function serializeUser(auth, done) {
        console.log('serialize step 6');
        authDB
            .getAuthDetails(auth.id)
            .then(function (foundAuth) {
                done(null, foundAuth);
            },
                function (err) {
                    done(err, null);
                });
    }

    // used to deserialize the user
    function deserializeUser(auth, done) {
        // console.log('deserializeUser has been called');
        if(auth){
            authDB
                .getAuthDetails(auth.id)
                .then(
                    function(foundAuth){
                        // console.log('the found auth on passport: ', foundAuth);
                        
                    done(null, foundAuth);
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
