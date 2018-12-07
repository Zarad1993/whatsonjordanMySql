(function(){
	angular
		.module('whatsOnJordan')
		.controller('homePageController', homePageController);

	function homePageController(userService, $location, eventsService, $route, $interval){
		var model = this;
		model.logout = logout;
		model.getAllFeedbacks = getAllFeedbacks;

		function init(){
			userService
				.checkUserLogin()
				.then(function(result){
					if(result){
						model.loggedUser = result;
						return;
					}else{
						model.loggedUser = null;
						return;
					}
				});

			userService
				.getAllMakers()
				.then(function(makers){
					model.makersList = makers.data;
				});

			eventsService
				.getAllEvents()
				.then(function(events){
					model.eventsList = events;
					if(events){
						getTheFeedbacks();
						for(var event in events){
							if(events[event].special){
								model.specialEvent = events[event];
								return;
							}
						}
					}		
				});

			function getTheFeedbacks(){
				userService
					.getAllFeedbacks()
					.then(function(result){
						model.feedbacks = result.data;	
						
						// autoscroll feedbacks
						if(model.feedbacks){
							$(document).ready(function() {
								start();
								function animateContent() {  
									var containerHeight = $('.feedbackContainer').height();
									var contentHeight = $('.feedbackContent').height();
									if(contentHeight <= containerHeight){
										contentHeight = containerHeight * 1.5;
									}
								    var animationOffset = containerHeight - contentHeight - 30;
								    $('.feedbackContent').animate({ "marginTop": (animationOffset)+ "px" }, model.feedbacks.length*5000);
								    $('.feedbackContent').animate({ "marginTop": "0px" }, 500, start());
								}

								function start(){
									setTimeout(function () {
								    	animateContent();
									}, 500);
								}  
							});
						}
					});
			}
			

			// This make the carousel works and set the sliding time
			$(document).ready(function() {
				$('.carousel').carousel({
					interval: 3000
				});  
	        });
		}

		init();

		function getAllFeedbacks(){
			userService
				.getAllFeedbacks()
				.then(function(result){
				});

		}

		function logout(){
			userService
				.logout()
				.then(function(){
					$location.url('/');
					$route.reload();
				});
		}


	}
})();