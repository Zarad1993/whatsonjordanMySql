(function() {
	angular
		.module('whatsOnJordan')
		.controller('makerEventDetails', makerEventDetails);

	function makerEventDetails($routeParams, eventsService, getterService, authService, $location, $route, loggedMaker) {

		var model = this;
		model.logout = logout;
		model.makePayment = makePayment;
		model.getTotals = getTotals;
		model.confirmAttendance = confirmAttendance;
		model.today = new Date();
		model.attendanceArray = [];
		model.countAttendance = countAttendance;
		model.specialDiscountAmount = 1;
		model.hadDiscount = hadDiscount;
		model.selectDiscount = selectDiscount;
		model.selectPaymentType = selectPaymentType;
		model.giveADiscountError = false;
		model.giveADiscount = giveADiscount;
		model.getUserPayments = getUserPayments;
		model.getGrandTotals = getGrandTotals;
		model.getEventFeedbacks = getEventFeedbacks;
		model.getAttendance = getAttendance;
		model.freezeMember = freezeMember;
		model.prepareFreezeDays = prepareFreezeDays;
		model.getFrozeMembers = getFrozeMembers;
		model.prepareExpenses = prepareExpenses;
		// model.addExpense = addExpense;
		model.attendanceReportCreater = attendanceReportCreater;
		model.isUserFreezeToday = isUserFreezeToday;
		model.removeFrozen = removeFrozen;
		model.showPaidMembers = showPaidMembers;

		




		// this is temporary in future the event maker created the discountTypes array
		model.discountTypes = [{
				name: 'Discount type...',
				amount: 0
			}, {
				name: 'No discount',
				amount: 0
			}, {
				name: 'family',
				amount: 10
			}, {
				name: 'group',
				amount: 10
			}, {
				name: 'special',
				types: [{
					name: 'special25',
					amount: 25
				}, {
					name: 'special50',
					amount: 50
				}, {
					name: 'special75',
					amount: 75
				}, {
					name: 'special100',
					amount: 100
				}]
			}

		];

		model.paymentTypes = [{
			name: 'Payment type...'
		}, {
			name: 'Down payment'
		}, {
			name: 'Weekly payment'
		}, {
			name: 'Full payment'
		}, ];

		// model.expensesTypes = [{
		// 	name: 'Expense type...'
		// }, {
		// 	name: 'Salary'
		// }, {
		// 	name: 'Hospitality'
		// }, {
		// 	name: 'Rental fees'
		// }, {
		// 	name: 'Misc'
		// }];



		// Temporary
		// model.expensesDetails = [{amount: 100, details: 'test of first', type: 'Salary', date: 'Mon Aug 06 2018'}];

		// model.calculateSessions = calculateSessions;
		// model.getTotalIncome = getTotalIncome;


		function init() {
			if (!loggedMaker) {
				$location.url('/login');
			}

			model.loggedMaker = loggedMaker;
			model.error2 = null;
			model.grandTotalPayments = 0;
			var eventId = $routeParams.eventId;

			// for default select option the first one is the title
			model.selectedDiscount = model.discountTypes[0];
			model.typeOfPayment = model.paymentTypes[0];
			// model.selectedExpenseType = model.expensesTypes[0];
			model.thereIsSpecialDiscount = false;
			// model.hadDiscount = hadDiscount;

			getterService
				.getAllExpenseTypes()
				.then(function(result){
					// console.log('the expense types', result.data);
					model.expensesTypes = result.data;
				})

			eventsService
				.findEventByEventId(eventId)
				.then(function(eventDetails) {
					model.eventFeedbacks = [];
					model.frozeMembers = [];
					model.eventDetails = eventDetails;
					model.discountedMembers = eventDetails.discountedMembers;
					model.grandTotals = 0;
					model.paidMembers = [];
					model.unPaidMembers = [];

					for (var i in model.eventDetails.registeredMembers) {
						model.grandTotals += getTotals(model.eventDetails.registeredMembers[i], model.eventDetails._id).totalOfPayments;
						for(var l in model.eventDetails.registeredMembers[i].userEventParameters){
							if(model.eventDetails.registeredMembers[i].userEventParameters[l].eventId == model.eventDetails._id){
								if(model.eventDetails.registeredMembers[i].userEventParameters[l].payments.length>0){
									model.paidMembers.push(model.eventDetails.registeredMembers[i]);
								}else{
									model.unPaidMembers.push(model.eventDetails.registeredMembers[i]);
								}
							}
						}
					}
					// }

					for (var x in model.eventDetails.registeredMembers) {
						// Calculate the grand total payments
						for (var j in model.eventDetails.registeredMembers[x].userEventParameters) {
							if (model.eventDetails.registeredMembers[x].userEventParameters[j].eventId === model.eventDetails._id) {
								for (var s in model.eventDetails.registeredMembers[x].userEventParameters[j].payments) {
									model.grandTotalPayments += model.eventDetails.registeredMembers[x].userEventParameters[j].payments[s].amount;
								}
								// collect the feedbacks
								for (var f in model.eventDetails.registeredMembers[x].userEventParameters[j].feedbacks) {
									var feed = model.eventDetails.registeredMembers[x].userEventParameters[j].feedbacks[f];
									feed.userName = model.eventDetails.registeredMembers[x].name.firstName + " " + model.eventDetails.registeredMembers[x].name.lastName;
									model.eventFeedbacks.push(feed);
								}
								if (model.eventDetails.registeredMembers[x].userEventParameters[j].freezeDays.length > 0) {
									// for(var z in model.eventDetails.registeredMembers[x].userEventParameters[j]){
									var freeze = {};
									freeze.userName = model.eventDetails.registeredMembers[x].name;
									freeze.days = model.eventDetails.registeredMembers[x].userEventParameters[j].freezeDays;
									model.frozeMembers.push(freeze);
									// }
								}
							}
						}
						// // Collect the feedbacks
						// for(var e in model.eventDetails.registeredMembers[x].userFeedback){
						// 	if(model.eventDetails.registeredMembers[x].userFeedback[e].eventId === eventId){
						// 		var feed = model.eventDetails.registeredMembers[x].userFeedback[e];
						// 		feed.userName = model.eventDetails.registeredMembers[x].name.firstName + " " + model.eventDetails.registeredMembers[f].name.lastName;
						// 		model.eventFeedbacks.push(feed);
						// 	}
						// }
					}
					// Calculate the total income from the event
					var totalOfMembers = model.eventDetails.registeredMembers.length;
					var membersWithoutDiscount = totalOfMembers - model.discountedMembers.length;
					// var incomeFromNoDiscount = membersWithoutDiscount * model.eventDetails.price; 
					var incomeFromNoDiscount = 0;
					var incomeFromDiscounted = 0;

					// for(var n in model.discountedMembers){
					// 	incomeFromDiscounted += model.eventDetails.price* model.discountedMembers[n].percentage;
					// }
					for (var n in model.eventDetails.registeredMembers) {
						for (var k in model.eventDetails.registeredMembers[n].userEventParameters) {
							if (model.eventDetails.registeredMembers[n].userEventParameters[k].eventId === model.eventDetails._id) {
								incomeFromDiscounted += model.eventDetails.registeredMembers[n].userEventParameters[k].discountedEventPrice;
								incomeFromNoDiscount += model.eventDetails.registeredMembers[n].userEventParameters[k].normalEventPrice;
							}
						}
					}
					model.totalIncomeFromEvent = incomeFromDiscounted + incomeFromNoDiscount;
				});
		}
		init();



		function selectDiscount(name) {
			model.discountTags = {};
			var today = new Date();
			var tagCode = today.getHours() + '' + today.getDate() + '' + today.getMonth() + '' + today.getFullYear() + '';
			if (model.selectedDiscount.name === 'family') {
				model.discountTags.familyTag = name.middleName + name.lastName + tagCode;
				model.discountTags.groupTag = '';
				model.thereIsFamilyDiscount = true;
				model.thereIsSpecialDiscount = false;
				model.thereIsGroupDiscount = false;
				return;
			} else if (model.selectedDiscount.name === 'group') {
				model.discountTags.groupTag = tagCode;
				model.discountTags.familyTag = '';
				model.thereIsGroupDiscount = true;
				model.thereIsSpecialDiscount = false;
				model.thereIsFamilyDiscount = false;
				return;
			} else if (model.selectedDiscount.name === 'special') {
				model.thereIsSpecialDiscount = true;
				model.thereIsFamilyDiscount = false;
				model.thereIsGroupDiscount = false;
				return;
			} else if (model.selectedDiscount.name === 'No discount') {
				model.thereIsSpecialDiscount = false;
				model.thereIsFamilyDiscount = false;
				model.thereIsGroupDiscount = false;
				return;
			} else if (model.selectedDiscount.name === 'Discount type...') {
				model.thereIsSpecialDiscount = false;
				model.thereIsFamilyDiscount = false;
				model.thereIsGroupDiscount = false;

			}

		}


		// function calculateSessions(){
		// 	var newEventDays;
		// 	var today = new Date();
		// 	var daysPerWeek = model.eventDetails.daysPerWeek;
		// 	var weeks, days;

		// 	// create event days array starting from the payment date
		// 	eventDaysLoop:
		// 	for(var d in model.eventDetails.eventDays){
		// 		if(today <= new Date(model.eventDetails.eventDays[d])){
		// 			newEventDays = model.eventDetails.eventDays.slice(d);
		// 			break eventDaysLoop;
		// 		}
		// 	}

		// 	// calculating weeks and days
		// 	if(newEventDays.length%daysPerWeek.length === 0){
		// 		weeks = newEventDays.length/daysPerWeek.length;
		// 		days = 0;
		// 		return {eventDays: newEventDays, weeksDays:{weeks: weeks, days: days}};
		// 	}else {
		// 		weeks = Math.floor(newEventDays.length/daysPerWeek.length);
		// 		days = newEventDays.length%daysPerWeek.length;
		// 		return {eventDays: newEventDays, weeksDays:{weeks: weeks, days: days}};
		// 	}
		// }



		// steps of payment:
		//		1. maker show registered members.
		// 		2. if he want to give a discount select discount button.
		// 		3. make a payment by select Pay button.
		// 		4. seslect Date
		// 		5. select payment type.
		// 		6. selectPaymentType function:
		//			- check if this is the first payment (looping user.payments for this eventId)
		// 				. if it is the first payment (newUser):
		// 					1. call calculateSessions() which return the event days.
		// 					2. check if user had discount then get the discount type and tag.
		// 					3. create memberObject containing:
		// 						{userId, discountType, discoutTag, eventDays, totalPrice, freezeDays}
		// 				. if not: 
		// 					1. the eventDays are the same of the eventDetails.eventDays.
		// 					2. check if user had discount then get the discount type and tag.
		// 					3. search for user in members array
		// 			- create an eventMembers array:
		// 			- 
		// 



		// Create {{{{{{{{{eventMembers}}}}}}}}} object instead of discounted members 
		// store:
		// {userId, discountType, discoutTag, eventDays, totalPrice, freezeDays}
		// ?????Freeze???????
		// when member ask for freezing days:
		// 1. check if he had already use the freeze before.
		// 2. if not select show a modal of the remaining dates to select the freezign days from
		// 3. add the froze dates array to the user eventMembers[user].freezeDays.
		// 4. when event days end push the users from eventMembers whome they had freeze to the new event they will create.
		// 5. when user register for new event check if he already had a froze days and deduct them from the event price.


		function selectPaymentType(paymentType, user) {
			var eventId = model.eventDetails._id;

			getTotals(user, eventId, function(totals) {
				model.totals = totals;
				switch (paymentType.name) {
					case 'Weekly payment':
						model.paymentAmount = Number(model.totals.discountedWeeklyPrice.toFixed(2));
						break;
					case 'Full payment':
						model.paymentAmount = Math.abs(model.totals.balance);
						// document.getElementById('paymentAmount').value = model.paymentAmount;
						break;
					case 'Down payment':
						model.paymentAmount = Number(model.totals.discountedDailyPrice.toFixed(2));
						// document.getElementById('paymentAmount').value = model.paymentAmount;
						break;
					case 'Payment type...':
						model.paymentAmount = 0;
						// document.getElementById('paymentAmount').value = '';
						break;
				}
			});
		}



		function giveADiscount(user, eventId, discountName, discountTags, specialDiscountType) {
			// Check first if the user already had a discount before...
			// for(var d in model.discountedMembers){
			// 	if(model.discountedMembers[d].userId === userId){
			// 		model.giveADiscountError = 'This user already had a '+ model.discountedMembers[d].discountType + 'discount';
			// 	}
			// }
			// How to cancel the request????????????
			
			var discount = {};
			var userId = user._id;
			discount.userId = userId;
			discount.eventId = eventId;
			switch (discountName) {
				case 'special':
					discount.discountType = discountName;
					switch (specialDiscountType) {
						case 'special25':
							discount.discountTag = 'special25';
							discount.percentage = 0.75;
							break;
						case 'special50':
							discount.discountTag = 'special50';
							discount.percentage = 0.50;
							break;
						case 'special75':
							discount.discountTag = 'special75';
							discount.percentage = 0.25;
							break;
						case 'special100':
							discount.discountTag = 'special100';
							discount.percentage = 0;
							break;
					}
					break;

				case 'family':
					discount.discountType = discountName;
					discount.discountTag = discountTags.familyTag;
					discount.percentage = 0.9;
					break;
				case 'group':
					discount.discountType = discountName;
					discount.discountTag = discountTags.groupTag;
					discount.percentage = 0.9;
					break;
				case 'No discount':
					discount.discountType = discountName;
					discount.discountTag = discountName;
					discount.percentage = 1;
					break;
			}


			// call getTotals instead of hadDiscout()
			getTotals(user, eventId, function(totals) {
				var ids = {
					userId: userId,
					eventId: eventId
				};
				discount.eventDays = totals.newEventDays;
				discount.discountedEventPrice = ((model.eventDetails.price / model.eventDetails.eventDays.length) * discount.percentage) * discount.eventDays.length;
				discount.normalEventPrice = (model.eventDetails.price / model.eventDetails.eventDays.length) * totals.newEventDays.length;
				// Check if the user had frozen days to compensates
				for(var f in model.eventDetails.frozeMembers){
					if(model.eventDetails.frozeMembers[f].userId === user._id && model.eventDetails.frozeMembers[f].days.length >0 && model.eventDetails.frozeMembers[f].compensated == false){
						// Calculate the discounted daily price then multiply by frozenDays then deduct the number from the final discountedEventPrice
						discount.discountedEventPrice -= ((model.eventDetails.price / model.eventDetails.eventDays.length) * discount.percentage) * (model.eventDetails.frozeMembers[f].days.length);
						discount.normalEventPrice -= ((model.eventDetails.price / model.eventDetails.eventDays.length) * discount.percentage) * (model.eventDetails.frozeMembers[f].days.length);
					}
				}
				if (discount.discountType !== 'No discount') {
					eventsService
						.addToDiscountedMembers(ids)
						.then(function(result) {
							if (result.data._id) {
								console.log('User Added...');
								model.giveADiscountError = false;
							} else {
								model.giveADiscountError = result.data;
							}
						});
					discount.normalEventPrice = 0;
					authService
						.updateUserEventParameters(discount)
						.then(function(result) {
							if (result.data._id) {
								console.log('User updated...');
								$route.reload();
							} else {
								model.giveADiscountError = result.data;
							}
						});
				} else {
					discount.discountedEventPrice = 0;
					authService
						.updateUserEventParameters(discount)
						.then(function(result) {
							if (result.data._id) {
								console.log('User updated...');
								$route.reload();
							} else {
								model.giveADiscountError = result.data;
							}
						});
				}

				for(var v in model.eventDetails.frozeMembers){
					if(model.eventDetails.frozeMembers[v].userId === user._id){
						removeFrozen(user._id, model.eventDetails._id, model.eventDetails.originalEventId);						
					}
				}
			});
			
		}

		function removeFrozen(userId, eventId, originalEventId){
			console.log(originalEventId);
			ids = {userId: userId, eventId: eventId, originalEventId: originalEventId};
			eventsService
				.removeFrozen(ids)
				.then(function(result){
					console.log(result.data);
				});
		}

		function getUserPayments(user, eventId) {
			for (var e in user.userEventParameters) {
				if (user.userEventParameters[e].eventId === eventId) {
					return user.userEventParameters[e].payments;
				}
			}
		}

		function getGrandTotals() {
			console.log(model.eventDetails);
			var grandTotal = 0;
			for (var i in model.eventDetails.registeredMembers) {
				grandTotal += getTotals(model.eventDetails.registeredMembers[i], model.eventDetails._id).totalOfPayments;
			}
			return grandTotal;
		}

		function getTotals(user, eventId, callBack) {
			var totals = {};
			var eventPrice = null;
			// var discountTag = null;
			totals.totalOfPayments = 0;
			// var discountType = null;
			var originalDailyPrice = model.eventDetails.price / model.eventDetails.eventDays.length;
			totals.originalDailyPrice = originalDailyPrice;
			var today = new Date();
			var daysPerWeek = model.eventDetails.daysPerWeek;

			// create event days array starting from the payment date
			eventDaysLoop:
				for (var d in model.eventDetails.eventDays) {
					// var dayInEventDays = new Date(model.eventDetails.eventDays[d]);
					if (today <= new Date(model.eventDetails.eventDays[d])) {
						totals.newEventDays = model.eventDetails.eventDays.slice(d);
						break eventDaysLoop;
					}
				}

			frozeMembersLoop:
				for(var z in model.eventDetails.frozeMembers){
					if(model.eventDetails.frozeMembers[z].userId == user._id){
						totals.userFrozeDetails = model.eventDetails.frozeMembers[z];
						break frozeMembersLoop;
					}
				}
			
			// calculating weeks
			totals.eventWeeks = Math.ceil(totals.newEventDays.length / daysPerWeek.length);



			// Calculate the event price for user whom have a discount
			for (var e in user.userEventParameters) {
				if (user.userEventParameters[e].eventId === eventId) {
					totals.discountedDailyPrice = originalDailyPrice * user.userEventParameters[e].percentage;
					// totals.fullEventPrice = totals.discountedDailyPrice * totals.newEventDays.length;
					if(user.userEventParameters[e].normalEventPrice >0){
						totals.fullEventPrice = user.userEventParameters[e].normalEventPrice;
					}else{
						totals.fullEventPrice = user.userEventParameters[e].discountedEventPrice;
					}
					// totals.eventNormalPrice = originalDailyPrice * totals.newEventDays.length;
					totals.discountedWeeklyPrice = totals.fullEventPrice / totals.eventWeeks;
					totals.discountType = user.userEventParameters[e].discountType;
					totals.discountTag = user.userEventParameters[e].discountTag;
					totals.userPayments = user.userEventParameters[e].payments;
					for (var x in user.userEventParameters[e].payments) {
						totals.totalOfPayments += JSON.parse(user.userEventParameters[e].payments[x].amount);
					}
				}
			}

			totals.balance = totals.totalOfPayments - totals.fullEventPrice;


			if (callBack) {
				callBack(totals);
			} else {
				model.userTotals = totals;
				return totals;
			}

			// for(var d in model.discountedMembers){
			// 	if(model.discountedMembers[d].userId === user._id){
			// 		eventPrice = model.eventDetails.price * model.discountedMembers[d].percentage;
			// 		discountType = model.discountedMembers[d].discountType; 
			// 		discountTag = model.discountedMembers[d].discountTag;
			// 	}
			// }


			// search for the user if he is in the discounted members then calculate the price and the balance
			// Calculate user's total of payments

			// for(var x in user.payments){
			// 	if(user.payments[x].eventId === eventId){
			// 		totalOfPayments+= JSON.parse(user.payments[x].paymentAmount);
			// 	}
			// }
			// if(eventPrice !== model.eventDetails.price){
			// 	return {eventPrice: eventPrice, discountType: discountType, discountTag: discountTag, total: totalOfPayments, balance: totalOfPayments-eventPrice};	
			// }else{
			// 	return {eventPrice: model.eventDetails.price, discountType: 'No discount.', discountTag: 'No discount', total: totalOfPayments, balance: totalOfPayments-model.eventDetails.price};
			// }


			// return totals;
		}



		// Check if user had a discount to disabled the discount button
		function hadDiscount(userId) {
			var hadIt = false;
			if (model.eventDetails.discountedMembers.indexOf(userId) !== -1) {
				hadIt = true;
			}
			return hadIt;
		}


		function makePayment(userId, eventId, paymentDate, paymentAmount) {
			var payment = {};
			payment.eventId = eventId;
			payment.userId = userId;
			payment.paymentDate = paymentDate;
			payment.paymentAmount = paymentAmount;
			authService
				.makePayment(payment)
				.then(function(result) {
					console.log('Payment done...');
					$route.reload();
				});
		}

		function getEventFeedbacks() {
			return model.eventFeedbacks;
		}


		function countAttendance() {
			model.attendedM = 0;
			model.attendanceArray = [];
			var userFrozeToday = false;

			for (var m in model.eventDetails.registeredMembers) {
				// console.log(model.eventDetails.registeredMembers[m]);
				parametersLoop:
				for (var p in model.eventDetails.registeredMembers[m].userEventParameters) {
					for (var h in model.eventDetails.registeredMembers[m].userEventParameters[p]) {
						if (model.eventDetails.registeredMembers[m].userEventParameters[p].eventId === model.eventDetails._id) {
							// Check if the user freeze for this day?
							checkFreeze:
							for(var j in model.eventDetails.registeredMembers[m].userEventParameters[p].freezeDays){
								if(model.eventDetails.registeredMembers[m].userEventParameters[p].freezeDays[j] === new Date().toDateString()){
									userFrozeToday = true;
									break parametersLoop;
								}
							}
							for (var a in model.eventDetails.registeredMembers[m].userEventParameters[p].attendedDays) {
								if (model.eventDetails.registeredMembers[m].userEventParameters[p].attendedDays.length === 0) {
									attended = false;
									break parametersLoop;
								} else if (model.eventDetails.registeredMembers[m].userEventParameters[p].attendedDays[a].date === new Date().toDateString()) {
									attended = model.eventDetails.registeredMembers[m].userEventParameters[p].attendedDays[a].attended;
									break parametersLoop;
								}
							}
						}
					}
					attended = false;
				}
				// console.log(!userFrozeToday);
				if(!userFrozeToday){
					model.attendanceArray.push({
						name: model.eventDetails.registeredMembers[m].name,
						userId: model.eventDetails.registeredMembers[m]._id,
						eventId: model.eventDetails._id,
						date: new Date().toDateString(),
						attended: attended
					});
				}
			}
			console.log(model.attendanceArray);
		}


		// function countAttendance(attendees){
		// 	model.attendedM = 0;
		// 	model.attendanceArray = [];

		// 	for(var m in model.eventDetails.registeredMembers){
		// 		model.attendanceArray.push({
		// 			eventId: model.eventDetails._id,
		// 			userId: model.eventDetails.registeredMembers[m]._id,
		// 			date: new Date().toDateString(),
		// 			attended: false
		// 		});
		// 	}


		// 	for(var n in model.attendanceArray){
		// 		for(var x in Object.keys(attendees)){
		// 			if(Object.keys(attendees)[x] === model.attendanceArray[n].userId){
		// 				model.attendanceArray[n].attended = attendees[Object.keys(attendees)[x]];
		// 				Object.keys(attendees).splice(x, 1);
		// 			}
		// 		}
		// 	}


		// 	for(var j in model.attendanceArray){
		// 		if(model.attendanceArray[j].attended === true){
		// 			model.attendedM+=1;
		// 		}
		// 	}
		// }



		// make it on the database
		function confirmAttendance(totalAttended) {
			console.log(totalAttended);
			authService
				.confirmAttendance(totalAttended)
				.then(function(result) {
					console.log(result);
				});
		}


		function getAttendance(attended) {
			var att = {};
			att.attended = attended.filter(function(a) {
				return a.attended === true;
			});
			att.missed = attended.filter(function(a) {
				return a.attended === false;
			});
			return att;
		}


		// get attendance report
		function attendanceReportCreater(user){
			var attReport = {
						attendedDays: [],
						attendedTotals: 0,
						missedTotals: 0
					};
			var para = user.userEventParameters.filter(function(parameter){
				return parameter.eventId === model.eventDetails._id;
			});
			var attendedDays = para[0].attendedDays;
			
			for(var i in attendedDays){
				if(attendedDays[i].attended === true){
					attReport.attendedDays.push({date: attendedDays[i].date, attMiss: 'attended'});
					attReport.attendedTotals +=1;
				}else if(attendedDays[i].attended === false){
					attReport.attendedDays.push({date: attendedDays[i].date, attMiss: 'missed'});
					// attReport.missed.missedDates.push(attendedDays[i].date);
					attReport.missedTotals +=1;
				}
			}
			model.attendanceReport = attReport;
			return attReport;
		}



		function isUserFreezeToday(user){
			var frozeToday = true;
			for(var i in user.userEventParameters){
				if(user.userEventParameters[i].eventId === model.eventDetails._id){
					for(var j in user.userEventParameters[i].freezeDays){
						if(user.userEventParameters[i].freezeDays[j] === new Date().toDateString()){
							return frozeToday;
						}
					}
				}
			}
			frozeToday = false;
			return frozeToday;
		}


		// function isUserFreezeToday(user){
		// 	for(var i in user.userEventParameters){
		// 		if(user.userEventParameters[i].eventId === model.eventDetails._id){
		// 			for(var j in user.userEventParameters[i].freezeDays){
		// 				if(user.userEventParameters[i].freezeDays[j] === new Date().toDateString()){
		// 					return true;
		// 				}else{
		// 					return false;
		// 				}
		// 			}
		// 		}
		// 	}
		// }


		function prepareFreezeDays(user) {
			model.userUseFreezeBefore = false;
			// check if user already freeze before
			for (var p in user.userEventParameters) {
				if (user.userEventParameters[p].eventId === model.eventDetails._id) {
					if (user.userEventParameters[p].freezeDays.length > 0) {
						model.userUseFreezeBefore = true;
						model.alreadyFrozeDays = user.userEventParameters[p].freezeDays;
					}
				}
			}
			model.frozeDays = {};
			var t = user.userEventParameters.filter(function(parameter) {
				return parameter.eventId === model.eventDetails._id;
			});
			model.daysToFreezeFrom = t[0].eventDays.filter(function(day) {
				return new Date(day) >= new Date();
			});
		}


		function freezeMember(userId, fullUserName, eventId, days) {
			// collect froze days
			var final = [];
			userFullName = fullUserName.firstName+' '+fullUserName.middleName+' '+fullUserName.lastName;
			// filter the selected days from the days
			for (var i in days) {
				if (days[i] === true) {
					final.push(i);
				}
			}
			var freezeObject = {
				userId: userId,
				userFullName: userFullName,
				eventId: eventId,
				days: final
			};
			// make it on DB
			authService
				.freezeMembership(freezeObject)
				.then(function(result) {
					console.log(result.data);
				});
			eventsService
				.addToFrozeMembers(freezeObject)
				.then(function(result){
					console.log(result.data);
				});
		}

		function getFrozeMembers() {
			// var froze = [];
			// for(var u in model.eventDetails.registeredMembers){
			// 	for(var p in model.eventDetails.registeredMembers[u].userEventParameters){
			// 		if(model.eventDetails.registeredMembers[u].userEventParameters[p].eventId === model.eventDetails._id && model.eventDetails.registeredMembers[u].userEventParameters[p].freezeDays.length > 0){
			// 			froze.push({
			// 				userName: model.eventDetails.registeredMembers[u].name,
			// 				frozeDays: model.eventDetails.registeredMembers[u].userEventParameters[p].freezeDays
			// 			});
			// 		}
			// 	}
			// }
			// console.log(model.frozeMembers)
			return model.frozeMembers;
		}


		// groupBy function to create summary
		// the parameters:
		// 		arrayOfObjects: array of objects to grouped by
		// 		filterProperty: property or key to filter of
		// 		sumsProperty: the property or key to accumulate for the summary
		function groupBy(arrayOfObjects, filterProperty, sumsProperty) {
			return arrayOfObjects.reduce(function(resultArray, oneObject) {
				var key = oneObject[filterProperty];
				if (!resultArray[key]) {
					resultArray[key] = 0;
				}
				resultArray[key] += oneObject[sumsProperty];
				return resultArray;
			}, {});
		}



		function prepareExpenses() {
			model.eventExpenses = model.eventDetails.expenses;
			var grouped = groupBy(model.eventExpenses, 'expenseType', 'expenseAmount');
			// console.log(grouped);
			model.expensesSummary = grouped;
			var totalExpenses = 0;
			for(var i in grouped){
				totalExpenses += grouped[i];
			}
			model.totalOfExpenses = totalExpenses;

			// console.log(model.eventExpenses);
			// var totals = {
			// 				expenses: 0,
			// 				salaryEx: 0,
			// 				hospitalityEx: 0,
			// 				rentalFees: 0,
			// 				miscEx: 0,
			// };
			// for(var i in model.eventExpenses){
			// 	totals.expenses += model.eventExpenses[i].expenseAmount;
			// 	switch(model.eventExpenses[i].expenseType){
			// 		case 'Salary':
			// 			totals.salaryEx += model.eventExpenses[i].expenseAmount;
			// 			break;
			// 		case 'Hospitality':
			// 			totals.hospitalityEx += model.eventExpenses[i].expenseAmount;
			// 			break;
			// 		case 'Rental fees':
			// 			totals.rentalFees += model.eventExpenses[i].expenseAmount;
			// 			break;
			// 		case 'Misc':
			// 			totals.miscEx += model.eventExpenses[i].expenseAmount;
			// 			break;
			// 	}
			// }
			// model.expensesSummary = totals;
			// console.log(totals);
		}


		// function addExpense(expense) {
		// 	// var expense = {};

		// 	// expense.expenseDate = expenses.date;
		// 	// expense.expenseType = expenseType.name;
		// 	// expense.expenseDetails = expenses.details;
		// 	// expense.expenseAmount = JSON.parse(expenses.amount);
		// 	var eventId = model.eventDetails.id;

		// 	eventsService
		// 		.addExpense(expense, eventId)
		// 		.then(function(result) {
		// 			// console.log(result.data);
		// 			// document.getElementById('expensesForm').reset();
		// 			// $route.reload();
		// 		});
		// }


		function showPaidMembers(v){
			if(v){
				// console.log(model.eventDetails.registeredMembers)
				model.eventDetails.registeredMembers = model.paidMembers;
			}else{
				model.eventDetails.registeredMembers = model.unPaidMembers;
			}
		}


		function logout() {
			authService
				.logout()
				.then(function() {
					$location.url('/');
				});
		}


	}

})();