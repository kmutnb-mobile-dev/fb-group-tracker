var express = require('express');
var app = express();

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var format = require('util').format;

// Static (Public)
app.use(express.static(__dirname + '/public'));



// API
app.get('/api/status/:status', function(req, res){ 
  MongoClient.connect('mongodb://root:root@linus.mongohq.com:10038/BuildingMaintenanceFB', function(err, db) {
  	if(err) throw err;
  	groupMessages = db.collection('group_message2');
  	
  	var query;

  	if(req.params.status == 'unknow'){
  		query = {
  			'status': ''
  		};
  	}else{
  		query = {
  			'status': '#'+ req.params.status
  		};
  	}

  	groupMessages.find().toArray(function(err, results) {
	    if(err) res.send({error:1});
	    else res.send(results);
	  });
	});
});




app.listen(3000); 


