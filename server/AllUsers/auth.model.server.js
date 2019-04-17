
// var mongoose = require('mongoose');
// var usersSchema = require('./users.schema.server.js');

// var authDB = mongoose.model('authDB', usersSchema);
var db = require('../databse');
// console.log('the db object:', Object.keys(db));


var authDB = db.Auth; // require('../models/user.model');
var membersDB = require('./members.model.server');
var makersDB = require('./makers.model.server');
var Contact = db.Contact; // require('../models/contact.model');
var contactsDB = require('./contacts.model.server');
var x_auth_role = db.X_Auth_Role;
var Roles = db.Role;
var Member = db.Member; // require('../models/member.model');
var Maker = db.Maker; // require('../models/maker.model');
var School = db.School; // require('../models/school.model');
var Address = db.Address; // require('../models/address.model');
var Nationality = db.Nationality; // require('../models/nationality.model');
var Grade = db.Grade; // require('../models/grade.model');

db.sequelize.sync();
// console.log('the User in the database is:', authDB);

module.exports = authDB;

authDB.createAuth = createAuth;
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
authDB.updateOrganizerProfile = updateOrganizerProfile;
authDB.makePayment = makePayment;
authDB.confirmAttendance = confirmAttendance;
authDB.submitFeedback = submitFeedback;
authDB.updateUserEventParameters = updateUserEventParameters;
authDB.freezeMembership = freezeMembership;
authDB.removeFrozeDays = removeFrozeDays;
authDB.getAllFeedbacks = getAllFeedbacks;
authDB.updateFeedbackByAdmin = updateFeedbackByAdmin;
authDB.getAuthDetails = getAuthDetails;
authDB.addAuthRole = addAuthRole;


function getAuthDetails(userId){
	return authDB
		.findOne({
			where: { id: userId },
			attributes: { exclude: ['password', 'resetPasswordExpires', 'resetPasswordToken']},
			include: [
				{all: true}, {model:Contact, include:[{all:true}]}
			]
			})
		.then(function(user){
				var plainUser = user.get({plain: true});
				return contactsDB
					.findContactsByAuthId(plainUser.id)
					.then(function(foundContacts){
						for(var i in plainUser.roles){
							if (plainUser.roles[i].name == 'Member'){
								plainUser.roles[i].contact = foundContacts[i].get({plain: true});
								if (plainUser.roles[i].contact.name){
									plainUser.roles[i].contact.firstName = plainUser.roles[i].contact.name.split(' ')[0];
									plainUser.roles[i].contact.middleName = plainUser.roles[i].contact.name.split(' ')[1];
									plainUser.roles[i].contact.lastName = plainUser.roles[i].contact.name.split(' ')[2];
								}
							}else{
								plainUser.roles[i].contact = foundContacts[i].get({ plain: true });
							}
						}
						// console.log('the user after add contacts: ', plainUser.roles);
						return plainUser;
					});
		});
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
	// var feedbackObject = {userId: model.loggedMember._id, eventId: eventId, eventName: eventName, feedbackText: feedbackText};
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


// the parameter updatedProfile is the member profile only not all roles
function updateProfile(updatedProfile){
	console.log('the updated profile: ', updatedProfile);
	var phones = updatedProfile.contact.phones;
	var removedMedical = updatedProfile.removedMedical;
	if (updatedProfile.name !== "Organizer"){
		// join the three parts of name to one part name
		updatedProfile.contact.name = updatedProfile.contact.firstName +" "+ updatedProfile.contact.middleName +" "+ updatedProfile.contact.lastName;
	}
	
	return contactsDB
		.updateContact(updatedProfile.contact, phones, removedMedical)
		.then(function(updatedContact){
			console.log('the updatedContact: ', updatedContact);
			return getAuthDetails(updatedContact.authId);
		});
}


function updateOrganizerProfile(updatedMakerProfile){
	return makersDB
			.updateOrganizerProfile(updatedMakerProfile.maker)
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


function createAuth(user){
	// console.log('the contact: ', contact);
	var rolename = '';
	if (user.email == 'admin@email.com'){
		rolename = 'Admin';
	}else{
		rolename = 'Member';
	}
	// prepare the roles:
	return Roles.findOne({where: {name: rolename}})
				.then(function(role){
					return authDB
							.create(user)
							.then(function(addedUser){
								return addedUser
								.addRole(role, {through: {active: true}})
								.then(function(authRole){
									console.log('the created authRole ',authRole[0][0].id);
									return contactsDB
										.addNewContact(addedUser.id, null)
										.then(function (addedContact) {
										// console.log('after add role: ', authRole[0][0]);			
											console.log('the addedUser: ', addedUser);
											console.log('the created contact: ', addedContact);
											// console.log('the created authRole: ', authRole);	
											return addedUser;
											
										});
								});
					})
				})

}


// in case of changing the user role like from user to maker by admin
function addAuthRole(updatedUser){
	var newRole = updatedUser.newRole;
	var newRoleId = newRole.id;
	var newRoleName = newRole.name;
	var userId = updatedUser.id;
	console.log('the new role: ', newRole);
	return authDB
		.findById(userId)
		.then(function(foundUser){
			return foundUser
			.addRole(newRoleId, { through: { active: true } })
			.then(function (authRole) {
				return contactsDB
					.addNewContact(foundUser.id, newRoleName)
					.then(function (addedContact) {
					console.log('after add role: ', authRole[0][0]);
					// newRoleName = newRole.name;
						console.log('the foundUser: ', foundUser);
						console.log('the created contact: ', addedContact);
						return foundUser;
					});
			});
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
				.findAll({
					// attributes: ['id', 'email', 'roles'],
					include: [{all: true}]
				});
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
							});
					}
				});
}

function findUserByEmail(userEmail){
	// console.log('checking the email: ', userEmail);
	return authDB
				.findOne({
					where:{email: userEmail},
					include: [{all: true}]
					// this one works
					// attributes: {exclude: ['email']},
					// include: [
					// 	// if the user is member
					// 	{
					// 		model: Member, include: [
					// 			Contact, Address, Nationality, School, Grade
					// 		]
					// 	},
					// 	{
					// 		model: Maker, include: [
					// 			{all: true}
					// 		]
					// 	}
					// ]
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

