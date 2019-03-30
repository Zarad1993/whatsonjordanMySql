(function(){
	angular
		.module('whatsOnJordan')
		.controller('homePageController', homePageController);

	function homePageController(authService, $location, eventsService, $route, $interval){
		var model = this;
		model.logout = logout;
		model.getAllFeedbacks = getAllFeedbacks;

		function init(){
			authService
				.checkAuthLogin()
				.then(function(result){
					if(result.data){
						model.loggedUser = result.data;
						return;
					}else{
						model.loggedUser = null;
						return;
					}
				});

			authService
				.getAllMakers()
				.then(function(makers){
					// console.log('the makers are: ', makers.data);
					model.makersList = makers.data;
				});

			eventsService
				.getAllEvents()
				.then(function(events){
					model.eventsList = events;
					if(events){
						// getTheFeedbacks();
						for(var event in events){
							if(events[event].special){
								model.specialEvent = events[event];
								return;
							}
						}
					}		
				});

			authService
				.getAllFeedbacks()
				.then(function(feedbacks){
					// console.log('all feedbacks: ', feedbacks);
					model.feedbacks = feedbacks.data;
					// autoscroll feedbacks
					if (model.feedbacks) {
						$(document).ready(function () {
							start();
							function animateContent() {
								var containerHeight = $('.feedbackContainer').height();
								var contentHeight = $('.feedbackContent').height();
								if (contentHeight <= containerHeight) {
									contentHeight = containerHeight * 1.5;
								}
								var animationOffset = containerHeight - contentHeight - 30;
								$('.feedbackContent').animate({ "marginTop": (animationOffset) + "px" }, model.feedbacks.length * 5000);
								$('.feedbackContent').animate({ "marginTop": "0px" }, 500, start());
							}

							function start() {
								setTimeout(function () {
									animateContent();
								}, 500);
							}
						});
					}
				})

			// function getTheFeedbacks(){
			// 	authService
			// 		.getAllFeedbacks()
			// 		.then(function(result){
			// 			model.feedbacks = result.data;	
						
			// 			// autoscroll feedbacks
			// 			if(model.feedbacks){
			// 				$(document).ready(function() {
			// 					start();
			// 					function animateContent() {  
			// 						var containerHeight = $('.feedbackContainer').height();
			// 						var contentHeight = $('.feedbackContent').height();
			// 						if(contentHeight <= containerHeight){
			// 							contentHeight = containerHeight * 1.5;
			// 						}
			// 					    var animationOffset = containerHeight - contentHeight - 30;
			// 					    $('.feedbackContent').animate({ "marginTop": (animationOffset)+ "px" }, model.feedbacks.length*5000);
			// 					    $('.feedbackContent').animate({ "marginTop": "0px" }, 500, start());
			// 					}

			// 					function start(){
			// 						setTimeout(function () {
			// 					    	animateContent();
			// 						}, 500);
			// 					}  
			// 				});
			// 			}
			// 		});
			// }
			

			// This make the carousel works and set the sliding time
			$(document).ready(function() {
				$('.carousel').carousel({
					interval: 3000
				});  
	        });
		}

		init();

		function getAllFeedbacks(){
			authService
				.getAllFeedbacks()
				.then(function(result){
				});

		}

		function logout(){
			authService
				.logout()
				.then(function(){
					$location.url('/');
					$route.reload();
				});
		}


	}
})();