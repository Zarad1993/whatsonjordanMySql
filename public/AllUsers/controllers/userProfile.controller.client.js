(function() {
	angular
		.module('whatsOnJordan')
		.controller('userProfileController', userProfileController);

	function userProfileController(userService, loggedUser, $location, $sce, $route) {
		var model = this;

		function init() {
			model.userProfile = loggedUser;
			model.loggedUser = loggedUser;
			model.upcommingProgram = [];
			model.userFeedbacks = [];
			model.registeredEventsList = model.userProfile.registeredEventsList;
			// get the upcomming daily program item
			for(var i in model.userProfile.registeredEventsList){
				inner: 
				for(var e in model.userProfile.registeredEventsList[i].programDailyDetails){
					if(new Date(e) >= new Date()){
						// var upcome = {}
						model.upcommingProgram.push({event: model.userProfile.registeredEventsList[i].name, 
													 date: new Date(e),
													 programDetails: model.userProfile.registeredEventsList[i].programDailyDetails[e]});
						break inner;
					}
				}
			}
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