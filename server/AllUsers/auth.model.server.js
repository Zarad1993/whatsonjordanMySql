
// var mongoose = require('mongoose');
// var usersSchema = require('./users.schema.server.js');

// var authDB = mongoose.model('authDB', usersSchema);
var db = require('../databse');
// console.log('the db object:', Object.keys(db));


var authDB = db.Auths; // require('../models/user.model');
var membersDB = require('./members.model.server');
var makersDB = require('./makers.model.server');
var Contact = db.Contact; // require('../models/contact.model');
var Roles = db.Roles;
var Member = db.Member; // require('../models/member.model');
var Maker = db.Maker; // require('../models/maker.model');
var School = db.School; // require('../models/school.model');
var Address = db.Address; // require('../models/address.model');
var Nationality = db.Nationality; // require('../models/nationality.model');
var Grade = db.Grade; // require('../models/grade.model');

db.sequelize.sync();
// console.log('the User in the database is:', authDB);

module.exports = authDB;

authDB.addNewUser = addNewUser;
authDB.addMemberIdToUser = addMemberIdToUser;
authDB.loginUser = loginUser;
authDB.getAllUsers = getAllUsers;
authDB.getAllMakers = getAllMakers;
authDB.findUserById = findUserById;
authDB.findUserByEmail = findUserByEmail;
authDB.addEventId = addEventId;
authDB.removeEventFromList = removeEventFromList;
authDB.findUserByGoogleId = findUserByGoogleId;
// authDB.addEventToUser = addEventToUser;
authDB.removeRegisteredEvent = removeRegisteredEvent;
authDB.addProfileImage = addProfileImage;
authDB.addTokenToUser = addTokenToUser;
authDB.findUserByToken = findUserByToken;
authDB.resetPassword = resetPassword;
authDB.updateProfile = updateProfile;
authDB.updateMakerProfile = updateMakerProfile;
authDB.makePayment = makePayment;
authDB.confirmAttendance = confirmAttendance;
authDB.submitFeedback = submitFeedback;
authDB.updateUserEventParameters = updateUserEventParameters;
authDB.freezeMembership = freezeMembership;
authDB.removeFrozeDays = removeFrozeDays;
authDB.getAllFeedbacks = getAllFeedbacks;
authDB.updateFeedbackByAdmin = updateFeedbackByAdmin;
authDB.getUserDetails = getUserDetails;
authDB.setUserRole = setUserRole;


function getUserDetails(userId){
	return authDB
		.findOne({
			where: { id: userId },
			attributes: { exclude: ['password', 'resetPasswordExpires', 'resetPasswordToken']},
			include: [
				{all: true}
				// {
				// 	model: Member, include: [
				// 		Contact, Address, Nationality, School, Grade
				// 	]
				// },
				// {
				// 	model: Maker, include: [
				// 		{all: true}
				// 	]
				// }
			]
			})
		.then(function(user){
			// console.log('the user on getUserDetails: ', user.get({plain: true}));
			return user.get({plain: true});
		})
}

function updateFeedbackByAdmin(feedback){
	// console.log(feedback);
	userId = feedback.userId;
	return authDB
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
	return authDB
				.find({roleId: 1})
				.then(function(users){
					return users;
				});
}


function removeFrozeDays(ids){
	var userId = ids.userId;
	var originalEventId = ids.originalEventId;
	return authDB
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
	return authDB
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
	return authDB
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
	return authDB
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
	return authDB
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
	return authDB
			.findById(userId)
			.then(function(user){
				for(var i in user.userEventParameters){
					if(user.userEventParameters[i].eventId === eventId){
						user.userEventParameters[i].payments.push({date: paymentDate, amount: paymentAmount});
						return user.save();
					}
				}
			});
	// return authDB
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
	// console.log('the updated profile: ', updatedProfile);
	return membersDB
				.updateMemberDetails(updatedProfile.memberId, updatedProfile.member)
				.then(function(result){
					console.log('the result from update member: ', result);	
					return result;
				})
				.then(function(){
					return authDB
						.findById(updatedProfile.id, {
							include: [
								{
									model: Member, include: [
										Contact, Address, Nationality, School, Grade
									]
								}
							]
						})
						.then(function(user){
							return user.get({plain: true});
						})
				})
}


function updateMakerProfile(updatedMakerProfile){
	return makersDB
			.updateMakerProfile(updatedMakerProfile.maker)
			.then(function(result){
				console.log('the result from update maker: ', result);
				return result;
			})
			.then(function(){
				return authDB
					.findById(updatedMakerProfile.id, {
						include: [
							{
								model: Maker, include: [{all: true}]
							}
						]
					})
					.then(function (maker) {
						return maker.get({ plain: true });
					})
			})
}

function resetPassword(user, newPassword){
	return authDB
			.findOne({ where: { id: user.id}, include: [{all:true}]})
			.then(function(user){
				user.password = newPassword;
				user.resetPasswordToken = null;
				user.resetPasswordExpires = null;
				return user.save();
			});
}

function findUserByToken(token){
	console.log('the token is: ', token);
	return authDB
		.findOne({ 
			where: { resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() }}
		})
		.then(function(user){
			if(user){
				return user;
			}else{
				return('Not found');
			}
		}, function(err){
			console.log(err);
			return err;
		});
}


function addTokenToUser(userEmail, token){
	return authDB
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
	return authDB
				.findUserById(userId)
				.then(function(user){
					user.profileImage = profileImage;
					return user.save();
				});
}



function findUserByGoogleId(googleId){
	return authDB.findOne({'google.id' : googleId});
}

function addNewUser(user, contact){
	// prepare the roles:
	return Roles.findOne({where: {name: "Member"}})
				.then(function(role){
					return authDB
						.create(user)
						.then(function(addedUser){
							return addedUser
									.addContact(contact)
									.then(function(){
										return addedUser
											.addRole(role)
											.then(function(result){
												console.log('the result after addRole', result);
												
												return addedUser;
											});
									});
						});

				});
}


// in case of changing the user role like from user to maker by admin
function setUserRole(updatedUser){
	var newRole = updatedUser.roleId;
	var userId = updatedUser.id;
	return authDB
		.findById(userId)
		.then(function(foundUser){
			if(newRole == 2){
				return foundUser
					.setUser_type(newRole)
					.then(function(){
						if (!foundUser.dataValues.makerId){
							return makersDB
								.addNewMaker()
								.then(function(createdMaker){
									console.log('the created maker: ', createdMaker.get({plain: true}));
									var makerId = createdMaker.id;
									return foundUser
										.setMaker(makerId)
										// .then(function () {
										// 	return foundUser.save();
										// }) 
									// return createdMaker;
								});
						}
					});
			}else if(newRole == 1){
				return foundUser
							.setUser_type(newRole)
							.then(function(){
								return foundUser.save();
							});
			}
		});
}

function addMemberIdToUser(userId, memberId){
	return authDB
			.findById(userId)
			.then(function(user){
				user.setMember(memberId);
				return user.save();
			})
}

function loginUser(username, password){
	// console.log('somebody call me', username);
	return authDB.findOne({email: username, password: password});
}

function getAllUsers(){
	return authDB
				.findAll({attributes: ['id', 'email', 'roleId']});
				// .populate('events')
				// .populate('registeredEventsList')
				// .exec();
}

function getAllMakers(){
	return authDB
				.findAll({
					where: {roleId: 2},
					attributes: { exclude: ['password', 'resetPasswordExpires', 'resetPasswordToken', 'updatedAt', 'createdAt']},
					include: [{model: Maker}]
				});
}

function findUserById(userId){
	console.log('the userId from the find userById is: ', userId)
	return authDB
				.findById(userId)
				.then(function(result){
					var user = result.get({plain: true});
					// console.log('the user from the find userById is: ', user);
					if (user.roleId === 1) {
						return membersDB
							.findMemberById(user.memberId)
							.then(function (member) {
								user.memberDetails = member;
								// console.log('the final user is: ', user);
								return user;
							})
					}
					// return result.dataValues;
				})
				// .populate('events')
				// .populate('registeredEventsList')
				// .exec();
}

function findUserByEmail(userEmail){
	// console.log('checking the email: ', userEmail);
	return authDB
				.findOne({
					where:{email: userEmail},
					// this one works
					// attributes: {exclude: ['email']},
					include: [
						// if the user is member
						{
							model: Member, include: [
								Contact, Address, Nationality, School, Grade
							]
						},
						{
							model: Maker, include: [
								{all: true}
							]
						}
					]
				})
				.then(function(foundUser){
					if(foundUser){
						// var user = foundUser.get({ plain: true });
						// console.log('the found user ', user);
						return foundUser;
					}else{
						return null;
					}
				})
}

function addEventId(userId, eventId){
	return findUserById(userId)
		.then(function(user){
			user.events.push(eventId);
			return user.save();
		});
}

// function addEventToUser(userDetails, eventDetails){
// 	return findUserById(userDetails.id)
// 				.then(function(user){
// 					user.addEvent(event);
// 					// this will be instead of registeredEventsList
// 					// var eventParams = {
// 					//  	eventId: eventId,
// 					//  	discountType: '',
// 					//  	discountTag: '',
// 					//  	percentage: 1,
// 					//  	eventDays: [],
// 					//  	discountedEventPrice: 0,
// 					//  	freezeDays: [],
// 					//  	payments: [],
// 					//  	attendedDays: [],
// 					//  	feedbacks: []
// 					// };
// 					// user.userEventParameters.push(eventParams);
// 					// // ////////////
// 					// user.registeredEventsList.push(eventId);
// 					// return user.save();
// 		});
// }


function removeRegisteredEvent(userId, eventId){
	return authDB
		.findById(userId)
		.then(function(user){
			var index = user.registeredEventsList.indexOf(eventId);
			user.registeredEventsList.splice(index, 1);
			return user.save();
		});
}

function removeEventFromList(userId, eventId){
	return authDB
		.findById(userId)
		.then(function(user){
			var index = user.events.indexOf(eventId);
			user.events.splice(index, 1);
			return user.save();
		});
}

