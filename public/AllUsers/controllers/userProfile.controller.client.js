(function() {
	angular
		.module('whatsOnJordan')
		.controller('userProfileController', userProfileController);

	function userProfileController(userService, loggedUser, $location, $sce, $route) {
		var model = this;

		function init() {
			if(!loggedUser){
				$location.url('/login')
			}
			model.userProfile = loggedUser;
			model.loggedUser = loggedUser;
			model.upcommingProgram = [];
			model.userFeedbacks = [];
			var memberId = loggedUser.member.id;
			userService
				.getMemberEvents(memberId)
				.then(function(registeredEvents){
					console.log('the registeredEvents list are: ', registeredEvents.data);
					model.registeredEventsList = registeredEvents.data;
					
					// get the upcomming daily program item
					for(var i in model.registeredEventsList){
						model.registeredEventsList[i].dailyDetails = JSON.parse(model.registeredEventsList[i].dailyDetails)
						inner: 
						for (var e in model.registeredEventsList[i].dailyDetails.programDailyDetails){
							if(new Date(e) >= new Date()){
								// var upcome = {}
								model.upcommingProgram.push({
															event: model.registeredEventsList[i].name, 
															date: new Date(e),
															programDetails: model.registeredEventsList[i].dailyDetails.programDailyDetails[e]});
								break inner;
							}
						}
					}
				})

			// model.registeredEventsList = model.userProfile.registeredEventsList;
			for(var j in model.userProfile.userEventParameters){
				for(var f in model.userProfile.userEventParameters[j].feedbacks){
					model.userFeedbacks.push(model.userProfile.userEventParameters[j].feedbacks[f]);
				}
			}
		}
		init();


		model.logout = logout;
		model.removeRegisteredEvent = removeRegisteredEvent;
		model.totalPayments = totalPayments;
		model.attendedDays = attendedDays;
		model.trustedUrl = trustedUrl;
		model.submitFeedback = submitFeedback;

		function submitFeedback(eventId, eventName,feedbackText){
			var feedbackObject = {userId: model.loggedUser._id, eventId: eventId, eventName: eventName, feedbackText: feedbackText};
			userService
				.submitFeedback(feedbackObject)
				.then(function(result){
					console.log(result.data);
					$route.reload();
				}, function(error){
					console.log(error);
				});
		}


		function trustedUrl(videoLink){
			var youtubeUrl = "https://www.youtube.com/embed/";
			var urlParts = videoLink.split("/");
			youtubeUrl += urlParts[urlParts.length-1];
			return $sce.trustAsResourceUrl(youtubeUrl);
		}

		function attendedDays(eventId){
			var attended = 0;
			var missed = 0;
			for(var i in loggedUser.attendedEvents){
				if(eventId === loggedUser.attendedEvents[i].eventId && loggedUser.attendedEvents[i].attended===true){
					attended+=1;
				} else if(eventId === loggedUser.attendedEvents[i].eventId && loggedUser.attendedEvents[i].attended===false){
					missed+=1;
				}
			}
			return {attended: attended, missed: missed};
		}
	


		function totalPayments(eventId, eventPrice){
			var totals = 0;
			var balance = 0;
			for(var i in loggedUser.payments){
				if(eventId === loggedUser.payments[i].eventId){
					totals+= JSON.parse(loggedUser.payments[i].paymentAmount);
				}
			}
			balance = totals - eventPrice;
			return {totals: totals, balance: balance};
		}

		function ValidateSize(file) {
	        		var FileSize = file.files[0].size / 1024 / 1024; // in MB
	        		if (FileSize > 2) {
	            		alert('File size exceeds 2 MB');
	           // $(file).val(''); //for clearing with Jquery
	        		} else {
	        			alert(file.files[0].size);
	        		}
    			}




		function logout(){
			userService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}



		function removeRegisteredEvent(eventId){
			// var _userId = $routeParams.userId;
			userService
				.removeRegisteredEvent(loggedUser._id, eventId)
				.then(function(response){
					$location.url('/profile');
				});
		}

	}
})();