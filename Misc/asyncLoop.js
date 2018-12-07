var obj = [ {id: 1, arr: [1,2,3,4,5,6,7,8,9,10]},
			{id: 2, arr: [10,20,30,40,50,60,70,80,90,100]},
			{id: 3, arr: [100,200,300,400,500,600,700,800,900,1000]},
			{id: 4, arr: [1000,2000,3000,4000,5000,6000,7000,8000,9000,10000]},
			{id: 4, arr: [10000,20000,30000,40000,50000,60000,70000,80000,90000,100000]},
			{id: 4, arr: [100000,200000,300000,400000,500000,600000,700000,800000,900000,1000000]}
		  ];
function doSomething(x){
	var totals = 0;
	for(var i in x){
		for(var j in x[i].arr){
			totals+=x[i].arr[j];
		}
	}
	// console.log(totals);
	return totals;
}

doSomething(obj);
// function asyncLoop(i, cb) {
//     if (i < obj.length) {
//     	usersDB
// 			.confirmAttendance(totalAttended[i])
// 			.then(function(result){
// 				totalResult.push(result);
// 				asyncLoop(i+1, cb);
// 			});
//     } else {
//         cb();
//     }
// }
// asyncLoop(0, function() {
//     res.send(totalResult);
// });