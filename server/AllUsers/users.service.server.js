module.exports = function(app) {


var usersDB 		= require('./users.model.server.js');
var membersDB		= require('./members.model.server');
var feedbacksDB 	= require('./feedbacks.model.server');
var makersDB		= require('./makers.model.server');
var eventsDB 		= require('../events/events.model.server.js');
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
app.post('/api/user/', addNewUser);
app.get('/api/checkUserLogin', checkUserLogin);
app.get('/api/isMaker', isMaker);
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
app.put('/api/maker/updateMakerProfile', updateMakerProfile);
app.put('/api/maker/makePayment', makePayment);
app.put('/api/maker/confirmAttendance', confirmAttendance);
app.put('/api/user/updateUserEventParameters', updateUserEventParameters);
app.put('/api/user/freezeMembership', freezeMembership);
app.delete('/api/user/removeFrozeDays/:userId/:eventId', removeFrozeDays);
app.get('/api/member/getAllFeedbacks', getAllFeedbacks);
app.put('/api/admin/updateFeedbackByAdmin', updateFeedbackByAdmin);
app.put('/api/admin/setUserRole', setUserRole);
app.post('/api/member/submitFeedback', submitFeedback);
app.get('/api/member/getMemberFeedbacks/:memberId', getMemberFeedbacks);

// ---------------------------------- /APIs requests ----------------------------------

	


// ------------------------------ Functions ------------------------------


function updateFeedbackByAdmin(req, res){
	var feedback = req.body;
	usersDB
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
	usersDB
		.removeFrozeDays(ids)
		.then(function(result){
			res.send(result);
		});
}


function freezeMembership(req, res){
	var freezeObject = req.body;
	usersDB
		.freezeMembership(freezeObject)
		.then(function(result){
			res.send(result);
		});
}


function updateUserEventParameters(req, res){
	var discount = req.body;
	usersDB
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
	    	usersDB
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
	usersDB
		.makePayment(payment)
		.then(function(result){
			res.send(result);
		});
}


function updateProfile(req, res){
	var updatedProfile = req.body;
	usersDB
		.updateProfile(updatedProfile)
		.then(function(result){
			console.log('the final Updated User in users.server: ', result);
			res.send(req.isAuthenticated() ? req.user : null);
			
		});
}

function updateMakerProfile(req, res){
	var updatedMakerProfile = req.body;
	usersDB
		.updateMakerProfile(updatedMakerProfile)
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
	usersDB
		.findUserByToken(token)
		.then(function(user){
			// if user found 
			if(user.email){
				newPassword = bcrypt.hashSync(password);
				usersDB
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
										'<p style="color: #DB685F; font-size: 4em;">Welcome ' + (result.userTypeId == 1 ? result.member.firstName : result.maker.firstName) + '!'+'</p>'+
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
        usersDB
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
								'<p style="color: #DB685F; font-size: 4em;">Welcome '+ (user.userTypeId==1 ? user.member.firstName : user.maker.firstName) + '!'+'</p>'+
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
	usersDB
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
		usersDB
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
		usersDB
			.addProfileImage(req.user._id, profileImage)
			.then(function(user){
			});
		res.redirect('/#!/userProfile');
}





function userStrategy(username, password, done) {
	usersDB
		.findUserByEmail(username)
		.then(
			function(foundUser){
				var user = foundUser;
				// console.log('the user from userStrategy: ', user);
				if(!user){
					return done(null, false);
				} else if(user && !bcrypt.compareSync(password, user.password)){
					return done(null, false);
				} else if(user && bcrypt.compareSync(password, user.password)){
					// console.log('user founded', user);
					// if(user.userTypeId === 1){
						// membersDB
						// 	.findMemberByUserId(user.id)
						// 	.then(function(member){
						// 		user.memberDetails = member;
						// 		console.log('the final user is: ', user);
								return done(null, user);
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
	usersDB
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
	                return usersDB.addNewUser(newGoogleUser);
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

// function findUser(req, res){
	// if (req.params.userEmail) {
	// 	var userEmail = req.params.userEmail;
	// 	usersDB
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
	// 	usersDB
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
	usersDB
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


function addNewUser(req, res){
	var newUser = req.body;
	// newUser.user_id = 1;
	newUser.password = bcrypt.hashSync(newUser.password);
	usersDB
		.addNewUser(newUser)
		.then(function (user){
			// console.log('the created user in usersDB is: ', addedUser.get({plain: true}));
			var addedUser = user.get({ plain: true })
			membersDB
				.addNewMember(addedUser.id)
				.then(function(member){
					var addedMember = member.get({plain: true});
					console.log('the addedMember is: ', addedMember);
					usersDB
						.addMemberIdToUser(addedUser.id, addedMember.id)
						.then(function(finalUser){
							// console.log('the final created user with member id is: ', finalUser);
							req.login(finalUser, function (err) {
								if (err) {
									return err;
								} else {
									// finalUser.firstName = addedMember.firstName;
									// finalUser.middleName = addedMember.middleName;
									// finalUser.lastName = addedMember.lastName;
									// finalUser.DOB = addedMember.DOB;
									// finalUser.gender = addedMember.gender;
									res.json(finalUser);
								}
							})
						})
				})
			
			// usersDB
			// 	.setUserRole(addedUser, 1)
			// 	.then(function(updatedUser){
			// 		req.login(updatedUser, function(err){
			// 			if(err){
			// 				return err;
			// 			}else{
			// 				res.json(updatedUser);
			// 			}
			// 		})
			// 	})
			
			// req.login(addedUser, function(err){
			// 	if(err){
			// 		return err;
			// 	}else{
					// commented for test
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


function checkUserLogin(req, res){
	console.log('step 8');
	// console.log('the user in req is: ', req.user);
	if (req.user) {
		// console.log('the req.user from the checkUserLogin:', req.user);
		if (req.user.userTypeId === 1){
			if(req.user.member.DOB){
				var birthDay = new Date(req.user.member.DOB);
				var today = new Date();
				req.user.age = Math.abs((new Date(today - birthDay.getTime())).getUTCFullYear() - 1970);
				console.log(req.user.age)
				res.send(req.isAuthenticated() ? req.user : null);
			}else{
				console.log('Please update your profile details to get the events fits to your age');
				res.send(req.isAuthenticated() ? req.user : null);
			}
		}else if(req.user.userTypeId == 2){
			res.send(req.isAuthenticated() ? req.user : null)
		}else if(req.user.userTypeId == 3){
			res.send(req.isAuthenticated() ? req.user : null)
		}
	} else {
		res.send(null);
	}
}

function isMaker(req, res){
	res.send(req.isAuthenticated() && req.user.userTypeId === 2 ? req.user : null);
}

function isAdmin(req, res){
	var admin = req.user;
	res.send(admin);
}

function checkAdmin(req, res, next){
	if (req.isAuthenticated() && req.user.userTypeId === 3){
		next();
	}
	else{
		res.send(null);
		return null;
	}
}

function addEventToUser(req, res){
	var parameters = req.body;
	var eventID = parameters.eventID;
	var memberId = parameters.memberId;
	// usersDB
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
	usersDB
		.removeRegisteredEvent(userId, eventId)
		.then(function(status){
			res.send(status);
		});
}

	function setUserRole(req, res){
		var updatedUser = req.body;
		usersDB
			.setUserRole(updatedUser)
			.then(function(result){
				res.send(result);
			})
	}


};


