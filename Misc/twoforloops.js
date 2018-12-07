// var balance = [];
var _ = require('underscore');

var temp = [{a:'1212', b:10}, {a:'2222', b:10}, {a:'3333', b:100}, {a:'1212', b:100}, {a:'2222', b:10}, {a:'4444', b:100}];

var balance = _.indexBy(temp, 'a');
console.log(balance)
// console.log(balance);
// for(var z in balance){
// 	balance[z].b=0;
// }
// console.log(balance)
// for(var x in balance){
// 	for(var n in temp){
// 		if(x === temp[n].a){
// 			console.log(balance[x].b)
// 			balance[x].b += temp[n].b;
// 		}
// 	}
// }


// var numbers = [1, 2, 5, -3];
// var squares = _.map(numbers, function(x) { return x*x; });
// console.log(squares);

// _.groupBy(temp, function(member){return(member)})


// for(var j in balance){
// 	// console.log(j)
// 	var currentItem = balance[j];
// 	console.log(currentItem);
// 	balance.splice(j, 1);
// 	// console.log(balance);
// 	// for(var x=j-1; x<balance.length-1; x++){

// 	// 	// if(balance[j].a === balance[x].a){
// 	// 	// 	console.log(balance[x]);
// 	// 	// }
// 	// 	console.log('x:', x)
// 	// 	console.log('j:', j)
// 	// }
// 	// console.log(j)
// 	balance[j] = currentItem;
// 	// console.log(balance);
// }





// for(var x in temp){
// 	if(balance.length !== 0){
// 		for(var j in balance){
// 			if(balance[j].a === temp[x].a){
// 				balance[j].b += temp[x].b;
// 			}else{
// 				balance.push(temp[x]);
// 			}
// 		}
// 	}else{
// 		balance.push(temp[x]);
// 	}
// }
// console.log(balance);


