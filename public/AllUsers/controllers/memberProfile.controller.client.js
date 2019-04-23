(function() {
	angular
		.module('whatsOnJordan')
		.controller('memberProfileController', memberProfileController);

	function memberProfileController(authService, loggedMember, $location, $sce, $route) {
		var model = this;

		function init() {
			if(!loggedMember){
				$location.url('/login');
				return;
			}
			console.log('the memberProfile: ', loggedMember);
			
			model.memberProfile = loggedMember.chosenRole;
			model.allRoles = loggedMember.allRoles;
			// model.upcommingProgram = [];			


			// model.userFeedbacks = [];
			// var memberId = loggedMember.member.id;
			// authService
			// 	.getMemberEvents(memberId)
			// 	.then(function(registeredEvents){
			// 		// The feedback list console.log('the registeredEvents list are: ', registeredEvents.data);
			// 		model.registeredEventsList = registeredEvents.data;
					
			// 		// get the upcomming daily program item
			// 		for(var i in model.registeredEventsList){
			// 			model.registeredEventsList[i].dailyDetails = JSON.parse(model.registeredEventsList[i].dailyDetails)
			// 			inner: 
			// 			for (var e in model.registeredEventsList[i].dailyDetails.programDailyDetails){
			// 				if(new Date(e) >= new Date()){
			// 					// var upcome = {}
			// 					model.upcommingProgram.push({
			// 												event: model.registeredEventsList[i].name, 
			// 												date: new Date(e),
			// 												programDetails: model.registeredEventsList[i].dailyDetails.programDailyDetails[e]});
			// 					break inner;
			// 				}
			// 			}
			// 		}
			// 	})
			// 	.then(function(){
			// 		authService
			// 			.getMemberFeedbacks(memberId)
			// 			.then(function(feedbacksList){
			// 				// console.log('the feedback list', feedbacksList);
			// 				model.memberFeedbacks = feedbacksList.data;
			// 			})
			// 	})
			// 	;

			// for(var j in model.memberProfile.userEventParameters){
			// 	for(var f in model.memberProfile.userEventParameters[j].feedbacks){
			// 		model.userFeedbacks.push(model.memberProfile.userEventParameters[j].feedbacks[f]);
			// 	}
			// }

		}
		init();

		model.logout = logout;
		// model.removeRegisteredEvent = removeRegisteredEvent;
		// model.totalPayments = totalPayments;
		// model.attendedDays = attendedDays;
		// model.trustedUrl = trustedUrl;
		// model.submitFeedback = submitFeedback;

		// function submitFeedback(eventId, feedbackText){
		// 	var feedbackObject = { memberId: loggedMember.member.id, eventId: eventId, details: feedbackText};
		// 	authService
		// 		.submitFeedback(feedbackObject)
		// 		.then(function(result){
		// 			console.log(result.data);
		// 			$route.reload();
		// 		}, function(error){
		// 			console.log(error);
		// 		});
		// }


		// function trustedUrl(videoLink){
		// 	var youtubeUrl = "https://www.youtube.com/embed/";
		// 	var urlParts = videoLink.split("/");
		// 	youtubeUrl += urlParts[urlParts.length-1];
		// 	return $sce.trustAsResourceUrl(youtubeUrl);
		// }

		// function attendedDays(eventId){
		// 	var attended = 0;
		// 	var missed = 0;
		// 	for(var i in loggedMember.attendedEvents){
		// 		if(eventId === loggedMember.attendedEvents[i].eventId && loggedMember.attendedEvents[i].attended===true){
		// 			attended+=1;
		// 		} else if(eventId === loggedMember.attendedEvents[i].eventId && loggedMember.attendedEvents[i].attended===false){
		// 			missed+=1;
		// 		}
		// 	}
		// 	return {attended: attended, missed: missed};
		// }
	


		// function totalPayments(eventId, eventPrice){
		// 	var totals = 0;
		// 	var balance = 0;
		// 	for(var i in loggedMember.payments){
		// 		if(eventId === loggedMember.payments[i].eventId){
		// 			totals+= JSON.parse(loggedMember.payments[i].paymentAmount);
		// 		}
		// 	}
		// 	balance = totals - eventPrice;
		// 	return {totals: totals, balance: balance};
		// }

		// function ValidateSize(file) {
	    //     		var FileSize = file.files[0].size / 1024 / 1024; // in MB
	    //     		if (FileSize > 2) {
	    //         		alert('File size exceeds 2 MB');
	    //        // $(file).val(''); //for clearing with Jquery
	    //     		} else {
	    //     			alert(file.files[0].size);
	    //     		}
    	// 		}




		function logout(){
			authService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}



		// function removeRegisteredEvent(eventId){
		// 	// var _userId = $routeParams.userId;
		// 	authService
		// 		.removeRegisteredEvent(loggedMember._id, eventId)
		// 		.then(function(response){
		// 			$location.url('/profile');
		// 		});
		// }

	}
})();