// custom filter to use it filter the events by the age entered on the all events page
angular
	.module('whatsOnJordan')
	.filter('ageFilter', function(){
		return function(events, age){
			if(age){
				events = events.filter(function(event){
					return (event.ageGroup.from <= age && event.ageGroup.to >= age);
				});
				return events;
			}else{
				return events;
			}
		};
	});