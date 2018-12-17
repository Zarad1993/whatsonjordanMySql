
// var mongoose = require('mongoose');
// var usersSchema = require('./users.schema.server.js');

// var usersDB = mongoose.model('usersDB', usersSchema);
var db = require('../databse');

// var usersDB = db.user;

var usersDB = require('../models/user.model.js')(db.sequelize, db.Sequelize);

module.exports = usersDB;

usersDB.addNewUser = addNewUser;
usersDB.loginUser = loginUser;
usersDB.getAllUsers = getAllUsers;
usersDB.getAllMakers = getAllMakers;
usersDB.findUserById = findUserById;
usersDB.findUserByEmail = findUserByEmail;
usersDB.addEventId = addEventId;
usersDB.removeEventFromList = removeEventFromList;
usersDB.findUserByGoogleId = findUserByGoogleId;
usersDB.addEventToUserEventsList = addEventToUserEventsList;
usersDB.removeRegisteredEvent = removeRegisteredEvent;
usersDB.addProfileImage = addProfileImage;
usersDB.addTokenToUser = addTokenToUser;
usersDB.findUserByToken = findUserByToken;
usersDB.resetPassword = resetPassword;
usersDB.updateProfile = updateProfile;
usersDB.makePayment = makePayment;
usersDB.confirmAttendance = confirmAttendance;
usersDB.submitFeedback = submitFeedback;
usersDB.updateUserEventParameters = updateUserEventParameters;
usersDB.freezeMembership = freezeMembership;
usersDB.removeFrozeDays = removeFrozeDays;
usersDB.getAllFeedbacks = getAllFeedbacks;
usersDB.updateFeedbackByAdmin = updateFeedbackByAdmin;

function updateFeedbackByAdmin(feedback){
	// console.log(feedback);
	userId = feedback.userId;
	return usersDB
			.findById(userId)
			.then(function(user){
				// console.log(user);
				for(var i in user.userEventParameters){
					for(var j in user.userEventParameters[i].feedbacks){
						// for(var f in user.userEventParameters[i].feedbacks){
							if(user.userEventParameters[i].feedbacks[j].eventName === feedback.eventName && user.userEventParameters[i].feedbacks[j].feedback === feedback.feedback){
								user.userEventParameters[i].feedbacks[j].approved = feedback.approved;
								return user.save();
							}
						// }
					}
				}
			});
}


function getAllFeedbacks(){
	return usersDB
				.find({userType: "user"})
				.then(function(users){
					return users;
				});
}


function removeFrozeDays(ids){
	var userId = ids.userId;
	var originalEventId = ids.originalEventId;
	return usersDB
				.findById(userId)
				.then(function(user){
					for(var i in user.userEventParameters){
						if(user.userEventParameters[i].eventId === originalEventId){
							user.userEventParameters[i].freezeDays.splice(0, user.userEventParameters[i].freezeDays.length);
							return user.save();
						}
					}
				});
}


function freezeMembership(freezeObject){
	var userId = freezeObject.userId;
	var eventId = freezeObject.eventId;
	var days = freezeObject.days;
	return usersDB
				.findById(userId)
				.then(function(user){
					for(var p in user.userEventParameters){
						if(user.userEventParameters[p].eventId === eventId){
							user.userEventParameters[p].freezeDays = days;
							return user.save();
						}
					}
				});
}

function updateUserEventParameters(discount){
	var userId = discount.userId;
	var eventId = discount.eventId;
	return usersDB
				.findById(userId)
				.then(function (user){
					for(var e in user.userEventParameters){
						if(user.userEventParameters[e].eventId === eventId){
							if(user.userEventParameters[e].discountType === ''){
							 	user.userEventParameters[e].discountType = discount.discountType;
							 	user.userEventParameters[e].discountTag = discount.discountTag;
							 	user.userEventParameters[e].percentage = discount.percentage;
							 	user.userEventParameters[e].discountedEventPrice = discount.discountedEventPrice;
							 	user.userEventParameters[e].normalEventPrice = discount.normalEventPrice;
							 	user.userEventParameters[e].eventDays = discount.eventDays;
							 	return user.save();								
							}else{
								var err = 'You Already had a discount!';
								return err;
							}
						}
					}
				});
}


function submitFeedback(feedbackObject){
	var userId = feedbackObject.userId;
	var eventId = feedbackObject.eventId;
	var feedDate = new Date();
	// var feedbackObject = {userId: model.loggedUser._id, eventId: eventId, eventName: eventName, feedbackText: feedbackText};
	var feed = {date: feedDate, eventName: feedbackObject.eventName, feedback: feedbackObject.feedbackText, userId: userId, approved: false};
	return usersDB
		.findById(userId)
		.then(function(user){
			// user.userFeedback.push(feedbackObject);
			for(var i in user.userEventParameters){
				if(user.userEventParameters[i].eventId === eventId){
					user.userEventParameters[i].feedbacks.push(feed);
				}
			}
			return user.save();
		});
}


function confirmAttendance(attendedUser){
	return usersDB
		.findById(attendedUser.userId)
		.then(function(user){
			// loop the userEventParameters
			for(var i in user.userEventParameters){
				if(user.userEventParameters[i].eventId === attendedUser.eventId){
					for(var j in user.userEventParameters[i].attendedDays){
						if(user.userEventParameters[i].attendedDays.length === 0){
							user.userEventParameters[i].attendedDays.push({
								date: attendedUser.date,
								attended: attendedUser.attended
							});
							return user.save();
						}else if(user.userEventParameters[i].attendedDays[j].date === attendedUser.date){
							user.userEventParameters[i].attendedDays[j].attended = attendedUser.attended;
							return user.save();
						}
					}
					user.userEventParameters[i].attendedDays.push({
						date: attendedUser.date,
						attended: attendedUser.attended
					});
					return user.save();
				}

			}
			// loop the attendedEvents if the event and the date is the same remove the old one and update the attended with the new object
			// for(var i in user.attendedEvents){
			// 	if(user.attendedEvents[i].eventId === attendedUser.eventId && user.attendedEvents[i].date === attendedUser.date){
			// 		user.attendedEvents.splice(i,1);
			// 		user.attendedEvents.push({eventId: attendedUser.eventId, 
			// 						  date: attendedUser.date, 
			// 						  attended: attendedUser.attended
			// 						});
			// 		return user.save();
			// 	}
			// }
			// user.attendedEvents.push({eventId: attendedUser.eventId, 
			// 						  date: attendedUser.date, 
			// 						  attended: attendedUser.attended
			// 						});
			// return user.save();
		});
}


function makePayment(payment){
	var userId = payment.userId;
	var eventId = payment.eventId;
	var paymentDate = payment.paymentDate;
	var paymentAmount = payment.paymentAmount;
	return usersDB
			.findById(userId)
			.then(function(user){
				for(var i in user.userEventParameters){
					if(user.userEventParameters[i].eventId === eventId){
						user.userEventParameters[i].payments.push({date: paymentDate, amount: paymentAmount});
						return user.save();
					}
				}
			});
	// return usersDB
	// 			.findById(userId)
	// 			.then(function (user){
	// 				user.payments.push(
	// 							{eventId: payment.eventId,
	// 							 paymentDate: payment.paymentDate,
	// 							 paymentAmount: JSON.parse(payment.paymentAmount)});
	// 				return user.save();
	// 			});
}



function updateProfile(updatedProfile){
	return usersDB
			.findByIdAndUpdate(updatedProfile._id, updatedProfile)
			.then(function(result){
				return result;
			});
}

function resetPassword(user, newPassword){
	return usersDB
			.findById(user._id)
			.then(function(user){
				user.password = newPassword;
				user.resetPasswordToken = undefined;
				user.resetPasswordExpires = undefined;
				return user.save();
			});
}

function findUserByToken(token){
	return usersDB
		.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}})
		.then(function(user){
			return user;
		}, function(err){
			console.log(err);
			return err;
		});
}


function addTokenToUser(userEmail, token){
	return usersDB
			.findUserByEmail(userEmail)
			.then(function(user){
				user.resetPasswordToken = token;
        		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        		return user.save();
		}, function(err){
			console.log(err);
		});
}
		


function addProfileImage(userId, profileImage){
	return usersDB
				.findUserById(userId)
				.then(function(user){
					user.profileImage = profileImage;
					return user.save();
				});
}



function findUserByGoogleId(googleId){
	return usersDB.findOne({'google.id' : googleId});
}

function addNewUser(user){
	user.gender = 'male';
	user.DOB = Date.now();
	user.grade = 9;
	
	return usersDB
			.create(
					user, 
					{fields: ['firstName', 'middleName', 'lastName', 'email', 'password']}
			);
}

function loginUser(username, password){
	return usersDB.findOne({email: username, password: password});
}

function getAllUsers(){
	return usersDB
				.find()
				.populate('events')
				.populate('registeredEventsList')
				.exec();
}

function getAllMakers(){
	return usersDB
				.find({userType: 'maker'});
}

function findUserById(userId){
	return usersDB
				.findById(userId)
				.populate('events')
				.populate('registeredEventsList')
				.exec();
}

function findUserByEmail(userEmail){
	console.log('checking the email: ', userEmail);
	console.log(usersDB);
	return usersDB.findOne({where:{email: userEmail}});
}

function addEventId(userId, eventId){
	return findUserById(userId)
		.then(function(user){
			user.events.push(eventId);
			return user.save();
		});
}

function addEventToUserEventsList(userId, eventId, userDetails){
	return findUserById(userId)
				.then(function(user){
					// this will be instead of registeredEventsList
					var eventParams = {
					 	eventId: eventId,
					 	discountType: '',
					 	discountTag: '',
					 	percentage: 1,
					 	eventDays: [],
					 	discountedEventPrice: 0,
					 	freezeDays: [],
					 	payments: [],
					 	attendedDays: [],
					 	feedbacks: []
					};
					user.userEventParameters.push(eventParams);
					// ////////////
					user.registeredEventsList.push(eventId);
					return user.save();
		});
}


function removeRegisteredEvent(userId, eventId){
	return usersDB
		.findById(userId)
		.then(function(user){
			var index = user.registeredEventsList.indexOf(eventId);
			user.registeredEventsList.splice(index, 1);
			return user.save();
		});
}

function removeEventFromList(userId, eventId){
	return usersDB
		.findById(userId)
		.then(function(user){
			var index = user.events.indexOf(eventId);
			user.events.splice(index, 1);
			return user.save();
		});
}

