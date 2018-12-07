// Month is 0 index 06 is July

// 0: Sun   1: Mon   2: Tue   3: Wed    4: Thu  5: Fri  6: Sat 


var startDate = new Date(2018, 6, 31);
var endDate = new Date(2018, 7, 31);

function calculateDays(start, end){
    var days = [];
    for (start; end>=start; start.setDate(start.getDate()+1)){
        if(start.getDay() === 6 || start.getDay() === 1 || start.getDay() === 3){
            days.push(start.toDateString());
        }
    }
    console.log(days);
    console.log(days.length);
    return days;

}

calculateDays(startDate, endDate);


// eventProgram = [{date: date, title: title, details: details, link: link}];

var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var numDays = [];
for(var i in days){
	switch (days[i]) {
	    case "Sun":
	        numDays.push(0);
	        break;
		case "Mon":
	        numDays.push(1);
	        break;
		case "Tue":
	        numDays.push(2);
	        break;
		case "Wed":
	        numDays.push(3);
	        break;
		case "Thu":
	        numDays.push(4);
	        break;
        case "Fri":
     	    numDays.push(5);
     	    break;
		case "Sat":
	        numDays.push(6);
	        break;
	}
}
console.log(numDays);

