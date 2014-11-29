var express = require('express');
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var app = express();

var request = require("request");

app.get('/getGroup', function(req, res)
{
	// var tag = req.query.tag;
	getGroup(function(err, results){
		res.send(results);
	});
	
});

var access_token = "CAACEdEose0cBAHJrE5001ZCe35wGI9EekuzLCswiVxm40xBxTI64QqBMJj46dlVAivZAhxO9ne4p9qReZC8jdSJpB7kAba7RSewqYNTagZBWwM77dkGsq9viqWeJcaEUnm84yfLjZC7AY6soRnJG7uUi27bcIkJTYKMn3vasZC8KYFBmtxVeOlV5YuMlaHQSH8SmH4ZA7kYdZCzTJ0O9gN7sVo6PZBseVcncZD";

request("https://graph.facebook.com/v2.1/1511624282387106?fields=feed{message,from,comments,attachments}&access_token="+access_token, function(error, response, body) {
	data = JSON.parse(body);
	insertGroup(data);
});

////////////////////////////////////////////mongo//////////////////////////////////////////////////////
insertGroup = function(data)
{
	MongoClient.connect('mongodb://root:root@linus.mongohq.com:10038/BuildingMaintenanceFB', function(err, db) 
	{

	  var collection = db.collection('group_message2'); 
	  
	  collection.find().toArray(function(err, results)
		{

			insert = function ()
			{
				for(var i = 0;i<data.feed.data.length;i++)
				{
					var count = 0;
					var count1 = 0 ;
					for(var n = 0 ; n<results.length;n++)
					{
						if(data.feed.data[i].id==results[n].id)
						{
							count++;
							
						}
					}
					if(count == 0)
					{
						data.feed.data[i].tag = [];
				  	if(typeof data.feed.data[i].comments != 'undefined')
				  	{	
					  	for(var n = 0;n<data.feed.data[i].comments.data.length;n++)
					  	{
					  		var status = "";
					  		var k =data.feed.data[i].comments.data[n].message.search("#");
					  		if(k>=0)
					  		{
						  		for(var j = k; j<data.feed.data[i].comments.data[n].message.length;j++)
						  		{  	 					
						  			if(data.feed.data[i].comments.data[n].message[j] == ' ')
						  			{
						  				break;
						  			}
						  			status += data.feed.data[i].comments.data[n].message[j];
						  		}
						  		if(status == '#ack')
						  		{
						  			data.feed.data[i].status = '#ack';
						  			count1++;
						  		}
						  		else if(status == '#fin')
						  		{
						  			data.feed.data[i].status = '#fin';
						  			count1++;
						  		}
						  		//else if(status == '#reopen')
						  		//{
						  			//data.feed.data[i].status = '#reopen';
						  			//count1++;
						  		//}
						  		else if(count1 == 0) 
						  		{
						  			data.feed.data[i].status = '#noti'
						  			data.feed.data[i].tag.push(status);
						  		}
						  		else 
						  		{
										data.feed.data[i].tag.push(status);
						  		}

						  	}
						  	else if(count1 == 0)
						  	{
						  		data.feed.data[i].status = '#noti'
						  		count1++;
						  	}
					  		
					  	}
					  }
					  else
					  {
					  	data.feed.data[i].status = '#noti'
					  }
						collection.insert(data.feed.data[i], function(err, docs) 
						{
							if(err) console.log("error");
							else console.log('ok');
						});
					}

				}
			};

			for(var i = 0;i<data.feed.data.length;i++)
			{
				var count=0;
				for(var n = 0 ; n<results.length;n++)
				{
					if(data.feed.data[i].id==results[n].id)
					{
						if(data.feed.data[i].updated_time>results[n].updated_time)
						{	
							collection.remove({id: data.feed.data[i].id},function(err)
					  	{
					  		if(err) console.log("remove erro");
					  		else console.log("remove ok");
					  	});
							
						}
					}
				}
				if(i == data.feed.data.length-1 )	
				{
					insert();
				}
			}
		
	
		});
	});
};

// setInterval(function(){alert("Hello")}, 3000);

getGroup = function(callback)
{
	// var data = '#'+data;
	MongoClient.connect('mongodb://root:root@linus.mongohq.com:10038/BuildingMaintenanceFB', function(err, db) 
	{
		var collection = db.collection('group_message2');  
		collection.find().sort({"_id":1}).toArray(callback);
		return callback;
	});
	
};

////////////////////////////////////////////////////////////////////////
app.use(express.static('public'));
app.listen(8080);


