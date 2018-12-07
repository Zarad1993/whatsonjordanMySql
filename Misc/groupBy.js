// Salary: 110     Misc: 15     hospitality: 70
var expenses = [
				{amount: 10, details: 'test of first', xtype: 'Salary'},
				{amount: 5, details: 'asd', xtype: 'Misc'},
				{amount: 20, details: 'zxc', xtype: 'Salary'},
				{amount: 10, details: 'qwe', xtype: 'Misc'},
				{amount: 30, details: 'dfdfg', xtype: 'Salary'},
				{amount: 50, details: 'hsjdlfh', xtype: 'hospitality'},
				{amount: 50, details: 'sdfdf', xtype: 'Salary'},
				{amount: 20, details: 'tyuyu', xtype: 'hospitality'}
			   ];

// Option one create details
// function groupBy(expenses, xtype){
// 	return expenses.reduce(function(resultArray, expense){
// 		var key = expense[xtype];
// 		if(!resultArray[key]){
// 			resultArray[key] = [];
// 		}
// 		resultArray[key].push(expense);
// 		return resultArray;
// 	}, {});
// }


// Option two totals
// groupBy function to create summary
// the parameters:
// 		arrayOfObjects: array of objects to grouped by
// 		filterProperty: property or key to filter of
// 		sumsProperty: the property or key to accumulate for the summary
function groupBy(arrayOfObjects, filterProperty, sumsProperty){
	return arrayOfObjects.reduce(function(resultArray, oneObject){
		var key = oneObject[filterProperty];
		if(!resultArray[key]){
			resultArray[key] = 0;
		}
		resultArray[key] += oneObject[sumsProperty];
		return resultArray;
	}, {});
}


var grouped = groupBy(expenses, 'xtype', 'amount');
console.log(grouped);



// var people = [
//   { name: 'Alice', age: 21 },
//   { name: 'Max', age: 20 },
//   { name: 'Jane', age: 20 }
// ];

// function groupBy(objectArray, property) {
//   return objectArray.reduce(function (acc, obj) {
//     var key = obj[property];
//     if (!acc[key]) {
//       acc[key] = [];
//     }
//     acc[key].push(obj);
//     return acc;
//   }, {});
// }

// var groupedPeople = groupBy(people, 'age');




// groupedPeople is:
// { 
//   20: [
//     { name: 'Max', age: 20 }, 
//     { name: 'Jane', age: 20 }
//   ], 
//   21: [{ name: 'Alice', age: 21 }] 
// }