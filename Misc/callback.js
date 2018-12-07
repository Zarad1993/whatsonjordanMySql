function doHomework(subject, callback) {
  console.log('Starting my '+subject+ ' homework.');
  callback(subject);
}

function finished(s){
  console.log('Finished my '+s+ ' homework');
}

doHomework('math', finished);