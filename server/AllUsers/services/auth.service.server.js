module.exports = function(app) {


var authDB 		    = require('../auth.model.server.js');
var contactsDB 		= require('../contacts.model.server');
var membersDB		= require('../members.model.server');
var feedbacksDB 	= require('../feedbacks.model.server');
var eventsDB 		= require('../../events/events.model.server.js');
var makersDB		= require('../makers.model.server');
var passport 		= require('passport');
var bcrypt   		= require('bcrypt-nodejs');
var GoogleStrategy 	= require('passport-google-oauth').OAuth2Strategy;
var nodemailer 		= require('nodemailer');
var path 			= require('path');
var aws 			= require('aws-sdk');
var multerS3 		= require('multer-s3');
var multer 			= require('multer');
var fs 				= require('fs');
var crypto 			= require('crypto');
var LocalStrategy 	= require('passport-local').Strategy;
var async			= require('async');




// ---------------------------- configurations --------------------------------------------------------

// Google configuration
	var googleConfig = {
	    clientID     : process.env.GOOGLE_CLIENT_ID,
	    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
	    callbackURL  : process.env.GOOGLE_CALLBACK_URL
	};



// AWS Configuration:
	aws.config.update({
	    secretAccessKey: process.env.AWSSecretKey,
	    accessKeyId: process.env.AWSAccessKeyId,
	    region: 'us-east-1'
	});
	var s3 = new aws.S3();


// Nodemailer configuration:
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: process.env.GMAIL_ACCOUNT,
			pass: process.env.GMAIL_PASS
		},
	});



// Image upload configuration:
	var upload = multer({
		// storage: storage, for the local storage
		storage: multerS3({
	        s3: s3,
	        bucket: 'jordanevents',
	        key: function (req, file, cb) {
	            // remove old image before upload new one
	            var params = {
	  					Bucket: "jordanevents", 
	  					Key: req.user.profileImage.key
	 				};
				s3.deleteObject(params, function(err, data) {
			   		if (err) console.log(err, err.stack); // an error occurred
			   		else     console.log(data);           // successful response
			   
	 			});

	            var filelocation = 'profilepictures/'+req.user._id +'.'+ file.originalname.split('.')[1]; 
	            cb(null, filelocation);
	        	}
		}),
		limits: {fileSize: 1000000},
		fileFilter: function(req, file, cb){
			checkFileType(file, cb);
		}
	});

	function checkFileType(file, cb){
		// Allowed extension
		var filetypes = /jpeg|jpg|png|gif/;
		var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
		var mimetype = filetypes.test(file.mimetype);
		if(extname && mimetype){
			return cb(null, true);
		} else {
			return cb('Only (jpeg jpg png gif) images allowed');
		}
	}


// Local Stratigy configuration
	passport.use('localUser', new LocalStrategy(userStrategy));

// Google Stratigy configuration
	passport.use(new GoogleStrategy(googleConfig, googleStrategy));

// ---------------------------- /configurations --------------------------------------------------------




// ---------------------------------- APIs requests ----------------------------------

app.get('/api/user/getAllUsers', getAllUsers);
app.get('/api/maker/getAllMakers', getAllMakers);
app.get('/api/user/findUserById/:userId', findUserById);
app.get('/api/user/findUserByEmail/:userEmail', findUserByEmail);
app.post('/api/user/login', passport.authenticate('localUser'), loginUser);
app.post('/api/user/loginAs', loginAs);
app.post('/api/auth/', createAuth);
app.get('/api/checkAuthLogin', checkAuthLogin);
app.get('/api/getAuthRoles/:authId', getAuthRoles);
app.get('/api/isOrganizer', isOrganizer);
app.get('/api/admin/isAdmin', checkAdmin, isAdmin);
app.post('/api/logout', logout);
app.post('/api/addEventToUser', addEventToUser);
app.get('/api/getMemberEvents/:memberId', getMemberEvents);
app.delete('/api/removeEventFromUser/:eventId', removeRegisteredEvent);

// login with google
app.get('/jordanEvents/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
app.get('/jordanEvents/auth/google/callback',
passport.authenticate('google', {
    successRedirect: '/#!/profile',
    failureRedirect: '/#!/loginUser'
}));
//------------------
app.post('/api/userProfile/uploadProfilePic', upload.single('profilePicture'), uploadImage);
app.post('/api/forgetPassword/:email', forgetPassword);
app.post('/api/resetPassword/:token', checkToken, resetPassword);
app.put('/api/user/updateProfile', updateProfile);
app.put('/api/maker/updateOrganizerProfile', updateOrganizerProfile);
app.put('/api/maker/makePayment', makePayment);
app.put('/api/maker/confirmAttendance', confirmAttendance);
app.put('/api/user/updateUserEventParameters', updateUserEventParameters);
app.put('/api/user/freezeMembership', freezeMembership);
app.delete('/api/user/removeFrozeDays/:userId/:eventId', removeFrozeDays);
app.get('/api/member/getAllFeedbacks', getAllFeedbacks);
app.put('/api/admin/updateFeedbackByAdmin', updateFeedbackByAdmin);
app.put('/api/admin/addAuthRole', addAuthRole);
app.post('/api/member/submitFeedback', submitFeedback);
app.get('/api/member/getMemberFeedbacks/:memberId', getMemberFeedbacks);

// ---------------------------------- /APIs requests ----------------------------------

	


// ------------------------------ Functions ------------------------------


function updateFeedbackByAdmin(req, res){
	var feedback = req.body;
	authDB
		.updateFeedbackByAdmin(feedback)
		.then(function(result){
			res.send(result);
		});
}



function getAllFeedbacks(req, res){
	feedbacksDB
		.getAllFeedbacks()
		.then(function(feedbacksList){
			// var feeds = [];
			// for(var i in users){
			// 	for(var j in users[i].userEventParameters){
			// 		if(users[i].userEventParameters[j].feedbacks && users[i].userEventParameters[j].feedbacks.length>0){
			// 			// console.log((users[i].userEventParameters[j].feedbacks));
			// 			for(var f in users[i].userEventParameters[j].feedbacks){
			// 				if(users[i].userEventParameters[j].feedbacks[f].feedback){
			// 					var temp = {};
			// 					temp.feedback = users[i].userEventParameters[j].feedbacks[f].feedback;
			// 					temp.userName = users[i].name.firstName+" "+users[i].name.lastName;
			// 					temp.eventName = users[i].userEventParameters[j].feedbacks[f].eventName;
			// 					temp.date = users[i].userEventParameters[j].feedbacks[f].date;
			// 					temp.approved = users[i].userEventParameters[j].feedbacks[f].approved;
			// 					temp.userId = users[i].userEventParameters[j].feedbacks[f].userId;
			// 					feeds.push(temp);
			// 				}
			// 			}
			// 		}
			// 	}	
			// }
			// console.log('the feeds are:');
			// console.log(feeds);
			res.send(feedbacksList);
		});
}



function removeFrozeDays(req, res){
	// var ids = req.params;
	var ids = {};
	ids.userId = req.params.userId;
	ids.originalEventId = req.params.originalEventId;
	// console.log(ids);
	authDB
		.removeFrozeDays(ids)
		.then(function(result){
			res.send(result);
		});
}


function freezeMembership(req, res){
	var freezeObject = req.body;
	authDB
		.freezeMembership(freezeObject)
		.then(function(result){
			res.send(result);
		});
}


function updateUserEventParameters(req, res){
	var discount = req.body;
	authDB
		.updateUserEventParameters(discount)
		.then(function (result){
			res.send(result);
		});
}


function submitFeedback(req, res){
	var feedbackObject = req.body;
	feedbacksDB
		.submitFeedback(feedbackObject)
		.then(function(result){
			if(result){
				res.send('feedback submitted');
			}
		});
}

function getMemberFeedbacks(req, res){
	var memberId = req.params.memberId;
	feedbacksDB
		.getMemberFeedbacks(memberId)
		.then(function(feedbacksList){
			res.send(feedbacksList);
		});
}

function confirmAttendance(req, res){
	
	var totalAttended = req.body;
	var totalResult = [];

	function asyncLoop(i, cb) {
	    if (i < totalAttended.length) {
	    	authDB
				.confirmAttendance(totalAttended[i])
				.then(function(result){
					totalResult.push(result);
					asyncLoop(i+1, cb);
				});
	    } else {
	        cb();
	    }
	}
	asyncLoop(0, function() {
	    res.send(totalResult);
	});

}


function makePayment(req, res){
	var payment = req.body;
	authDB
		.makePayment(payment)
		.then(function(result){
			res.send(result);
		});
}

function updateProfile(req, res){
	var updatedProfile = req.body;
	console.log('the profile to update profile', updatedProfile);	
	authDB
		.updateProfile(updatedProfile)
		.then(function(result){
			result.chosenRole = updatedProfile.name;
			console.log('the final Updated User in users.server: ', result);
			req.session.passport.user = result;
			req.session.save();
			res.send(req.isAuthenticated() ? req.session.passport.user : null);
		});
}

function updateOrganizerProfile(req, res){
	var updatedMakerProfile = req.body;
	authDB
		.updateOrganizerProfile(updatedMakerProfile)
		.then(function(result){
			console.log('the final Updated Maker in users.server: ', result);
			res.send(req.isAuthenticated() ? req.user : null);
		})
}

// Do the action here
function checkToken(req, res, next){
	var token = req.params.token;
	var password = req.body.password;
	// resetPassword(req, res, password);
	authDB
		.findUserByToken(token)
		.then(function(user){
			// if user found 
			if(user.email){
				newPassword = bcrypt.hashSync(password);
				authDB
					.resetPassword(user, newPassword)
					.then(function(result){	
						console.log('the result after reset password: ', result);					
						// send email to reset password
						var mailOptions = {
							from: 'whatsonjordan@gmail.com',
							to: result.email,
							subject: 'Password changed...',
							html: 
								'<div align="center" style="background-color: beige">'+
										'<br><br>'+
										'<img src="cid:whatsOnJordanLogo001" style="width: 300px; height: 200px;"/>'+
										'<br>'+
										'<p style="color: #DB685F; font-size: 4em;">Welcome ' + (result.roleId == 1 ? result.member.firstName : result.maker.firstName) + '!'+'</p>'+
										'<p style="font-size: 1.5em;" > You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>'+
										'<br>'+
										'<p style="font-size: 1.5em;">This is to confirm that your password has been changed successfully. </p>'+
										'<br>'+ 
										'<p style="font-size: 1.5em;">You can login to your account with your new password normally. </p>'+
										'<br>'+ 
										'<p style="font-size: 1.5em;"> http://' + req.headers.host + '/#!/login'+'</p>'+
										'<br>'+
										'<p style="font-size: 1.5em;">Whats on Jordan Team</p>'+
										'<br>'+
										'<p> --   </p>'+
								'</div>',
								
								attachments: [{
						        	filename: 'wojo2.jpg',
						        	path: __dirname+'/../../public/img/logo/wojo2.jpg',
						        	cid: 'whatsOnJordanLogo001' 
						    	}]
							
						};
						transporter.sendMail(mailOptions, function(error, info){
							console.log('the error: ', error);
							console.log('the info: ', info);
							if (error) { 
								console.log(error); 
							}else{
								console.log('Email sent to: ' + result.email);
								// res.sendStatus(200);
							}
						});

						resetPassword(req, res, result);
					});
			} else{ // if there is no token for the user or the token expired
				res.send(user);
				return;
			}
		}, function(err){
			console.log(err);
			return err;
		});
}


// send the status from here
function resetPassword(req, res, user){
	console.log('Password changed');
	req.login(user, function(err){
		if(err){
			return err;
		} else{
			res.send(user);
		}
	});
}

function forgetPassword(req, res){
	var userEmail = req.params.email;
	crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        authDB
        	.addTokenToUser(userEmail, token)
        	.then(function(user){
				console.log('the user after add token: ', user);
				
				// send email to reset password
				var mailOptions = {
					from: 'whatsonjordan@gmail.com',
					to: userEmail,
					subject: 'Password reset...',
					html: 
						'<div align="center" style="background-color: beige">'+
								'<br><br>'+
								'<img src="cid:whatsOnJordanLogo001" style="width: 300px; height: 200px;"/>'+
								'<br>'+
								'<p style="color: #DB685F; font-size: 4em;">Welcome '+ (user.roleId==1 ? user.member.firstName : user.maker.firstName) + '!'+'</p>'+
								'<p style="font-size: 1.5em;" > You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>'+
								'<br>'+
								'<p style="font-size: 1.5em;">Please click on the following link, or paste it into your browser to complete the process: </p>'+
								'<br>'+
								'<p style="font-size: 1.5em;"> http://' + req.headers.host + '/#!/resetPassword/' + token +'</p>'+
								'<br>'+
								'<p style="font-size: 1.5em;">If you did not request this, please ignore this email and your password will remain unchanged. </p>'+
								'<br>'+
								'<p style="font-size: 1.5em;">What\'s on Jordan Team</p>'+
								'<br>'+
								'<p> .   </p>'+
						'</div>',
						
						attachments: [{
				        	filename: 'wojo2.jpg',
				        	path: __dirname+'/../../public/img/logo/wojo2.jpg',
				        	cid: 'whatsOnJordanLogo001' 
				    	}]
					
				};
				transporter.sendMail(mailOptions, function(error, info){
					if(error){console.log(error);}
					console.log(info);
					console.log('Email sent to: ' + user.email);
					res.sendStatus(200);
				});
		    });
    });
}





function findUserByEmail(req, res){
	var userEmail = req.params.userEmail;
	authDB
		.findUserByEmail(userEmail)
		.then(
			// if seccess
			function(result){
				// console.log('the result from check mail is: ',result);
				if(result){
					res.send(result);
					return;
				} else {
					res.send('error');
					return;
				}
			}//,
			// function(err){
			// 	res.sendStatus(404).send(err);
			// 	return;
			// }
		)
		.catch(function(err){
			console.log('problem communicating with db');
			res.status(500).json(err);
		});
}

function findUserById(req, res){
	var userId = req.params.userId;
		authDB
			.findUserById(userId)
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




function uploadImage(req, res){
		var profileImage = req.file;
		// if there is no file uploaded throw an error
		if(profileImage == undefined){
			res.send('No file selected');
			return;
		}else if (profileImage.size > 1000000){
			res.send('Image size is greater than 1MB');
			return;
		}
		// add the file data to user database
		authDB
			.addProfileImage(req.user._id, profileImage)
			.then(function(user){
			});
		res.redirect('/#!/memberProfile');
}





function userStrategy(username, password, done) {
	authDB
		.findUserByEmail(username)
		.then(
			function(foundUser){
				var auth = foundUser;
				// console.log('the user from userStrategy: ', user);
				if(!auth){
					return done(null, false);
				} else if(auth && !bcrypt.compareSync(password, auth.password)){
					return done(null, false);
				} else if(auth && bcrypt.compareSync(password, auth.password)){
					// console.log('user founded', user);
					// if(user.roleId === 1){
						// membersDB
						// 	.findMemberByUserId(user.id)
						// 	.then(function(member){
						// 		user.memberDetails = member;
						// 		console.log('the final user is: ', user);
								return done(null, auth);
							// })
					// }
					// return done(null, user);
				} 
			},
			function(err){
				if(err){
					return done(err);
				}
			}
		);
}





function googleStrategy(token, refreshToken, profile, done) {
	authDB
	    .findUserByGoogleId(profile.id)
	    .then(
	        function(user) {
	            if(user) {
	                return done(null, user);
	            } else {
	                var email = profile.emails[0].value;
	                var emailParts = email.split("@");
	                var newGoogleUser = {
	                    username:  emailParts[0],
	                    firstName: profile.name.givenName,
	                    lastName:  profile.name.familyName,
	                    email:     email,
	                    google: {
	                        id:    profile.id,
	                        token: token
	                    }
	                };
					return authDB.createAuth(newGoogleUser);
	            }
	        },
	        function(err) {
	            if (err) { return done(err); }
	        }
	    )
	    .then(
	        function(user){
	            return done(null, user);
	        },
	        function(err){
	            if (err) { return done(err); }
	        }
	    );
}




function logout(req, res){
	req.session.destroy();
	req.logout();
	res.sendStatus(200);
}


function loginUser(req, res){
	var user = req.user;
	// console.log('the user details are: ', user);
	res.json(user);
}

function loginAs(req, res){
	var selectedRole = req.body;
	// console.log('the selected role: ', selectedRole);
	// req.session.passport....chosenRole = 'Organizer'
	for (var i in req.session.passport.user.roles){
		if (req.session.passport.user.roles[i].id == selectedRole.id){
			// req.session.passport.user.roles[i].loggedWithin = true;
			req.session.passport.user.chosenRole = req.session.passport.user.roles[i].name;
			req.session.save();
				
			res.send(req.session.passport.user);
			// return;
		}
	}
	// console.log('the session: ', req.session);
	

		
}

// function findUser(req, res){
	// if (req.params.userEmail) {
	// 	var userEmail = req.params.userEmail;
	// 	authDB
	// 		.findUserByEmail(userEmail)
	// 		.then(
	// 			// if seccess
	// 			function(result){
	// 				if(result){
	// 					res.send(result);
	// 					return;
	// 				} else {
	// 					res.send('error');
	// 					return;
	// 				}
	// 			},
	// 			function(err){
	// 				res.sendStatus(404).send(err);
	// 				return;
	// 			}
	// 		);

	// }
	
	// if(req.query.userId){
	// 	var userId = req.query.userId;
	// 	authDB
	// 		.findUserById(userId)
	// 		.then(function(result){
	// 			if(result){
	// 				res.send(result);
	// 				return;
	// 			} else {
	// 				res.send('error');
	// 				return;
	// 			}
	// 		});
	// }
// }


function getAllUsers(req, res) {
	authDB
		.getAllUsers()
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


function getAllMakers(req, res){
	makersDB
		.getAllMakers()
		.then(function(makers){
			if(makers){
				res.send(makers);
				return;
			} else {
				res.send('error');
				return;
			}
		});
}


function createAuth(req, res){
	var newUser = req.body;
	newUser.password = bcrypt.hashSync(newUser.password);
			authDB
				.createAuth(newUser)
				.then(function (user){
					console.log('the created user', user);
					req.login(user, function (err) {
						if (err) {
							res.send(err);
							return;
						} else {
							res.json(user);
							return;
						}
					});

			// req.login(addedUser, function(err){
			// 	if(err){
			// 		return err;
			// 	}else{
					// var mailOptions = {
					// 	from: 'whatsonjordan@gmail.com',
					// 	to: addedUser.email,
					// 	subject: 'Registration complete',
					// 	html: 
					// 		'<div align="center" style="background-color: beige">'+
					// 				'<br><br>'+
					// 				'<img src="cid:whatsOnJordanLogo001" style="width: 300px; height: 200px;"/>'+
					// 				'<br>'+
					// 				'<h1 style="color: #DB685F; font-size: 4em;">Welcome '+ addedUser.name.firstName + '!'+'</h1>'+
					// 				'<h3 style="font-size: 2em;" >Your registration has been completed...</h3>'+
					// 				'<br>'+
					// 				'<p style="font-size: 1.5em;">You can now enjouy our services by logging in to <a href="www.whatsonjordan.com">our site</a> and register for deferents activities</p>'+
					// 				'<br>'+
					// 				'<h3 style="font-size: 2em;">What\'s on Jordan Team</h3>'+
					// 				'<br><br><br><br><br>'+
					// 		'</div>',
							
					// 		attachments: [{
					//         	filename: 'wojo2.jpg',
					//         	path: __dirname+'/../../public/img/logo/wojo2.jpg',
					//         	cid: 'whatsOnJordanLogo001' 
					//     	}]
						
					// 	};

					// transporter.sendMail(mailOptions, function(error, info){
					// 	if (error) {
					// 		console.log(error);
					// 	} else {
					// 		console.log('Email sent: ' + info.response);
					// 	}
					// });

					// res.json(addedUser);
				// }
			// });
		}, function(err){
			// console.log('the error is', err.errors);
			res.send(err);
		});
}



function checkAuthLogin(req, res){
	console.log('step 8');
	// the passport serialize put the auth in the req.user
	if (req.user) {
		console.log('the auth to check type: ', req.session.passport.user);
		console.log('the user in session: ', req.user);
		res.send(req.isAuthenticated() ? req.session.passport.user : null);
	} else {
		res.send(null);
	}
}

function getAuthRoles(req, res){
	// var authId = req.params.authId;
	if(req.user){
		var auth = req.user;
		// to set later > 1
		if (auth.roles) {
			var roles = [];
			for (var r in auth.roles) {
				if (auth.roles[r].x_auth_role.active){
					roles.push(auth.roles[r]);
				}
			}
			res.send(roles);
		}
	}
}


function isOrganizer(req, res){
	for (var i in req.session.passport.user.roles) {
		if (req.session.passport.user.roles[i].loggedWithin) {
			res.send(req.isAuthenticated() ? req.session.passport.user : null);
			return;
		}
	}
}

function checkAdmin(req, res, next){
	if (req.isAuthenticated() && req.user.roles[0].name == 'Admin'){
		next();
	}
	else{
		res.send(null);
		return null;
	}
}

function isAdmin(req, res){
	var admin = req.user;
	res.send(admin);
}


function addEventToUser(req, res){
	var parameters = req.body;
	var eventID = parameters.eventID;
	var memberId = parameters.memberId;
	// authDB
	// 	.updateProfile(userDetails)
	// 		.then(function(updatedUser){
				membersDB	
					.addEventToMember(eventID, memberId)
						.then(function(result){
							// eventsDB
							// 	.addMemberToEvent(eventId, userId)
							// 		.then(function (result){
							// 			console.log(result);
							// 		});
							console.log('what happen on addEventToMember', result);
							
							res.send(result);
						});
			// });
		// .addEventToUser(userId, eventId, userDetails)
		// .then(function(user){
		// 	eventsDB
		// 		.addMemberToEvent(eventId, userId)
		// 		.then(function (result){
		// 			console.log(result);
		// 		});
		// 	res.send(user);
		// });
}

function getMemberEvents(req, res){
	var memberId = req.params.memberId;
	membersDB
		.getMemberEvents(memberId)
		.then(function(registeredEvents){
			res.send(registeredEvents);
		})
}

function removeRegisteredEvent(req, res){
	var userId = req.user._id;
	var eventId = req.params.eventId;
	authDB
		.removeRegisteredEvent(userId, eventId)
		.then(function(status){
			res.send(status);
		});
}

	function addAuthRole(req, res){
		var updatedUser = req.body;
		authDB
			.addAuthRole(updatedUser)
			.then(function(result){
				res.send(result);
			})
	}


};


