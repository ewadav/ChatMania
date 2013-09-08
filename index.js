// David F Ewald
// ChatMania
// The small real time chat application

var express = require("express");
var app = express();
var port = 3700;
var redis = require('redis');

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page", {
    	title: "Chat Mania"
    });
});

app.use(express.static(__dirname + '/public'));


//Setup Socket IO
var io = require('socket.io').listen(app.listen(port));

//Setup Redis
var redisClient = redis.createClient();

// Listening to the connection of sockets
io.sockets.on('connection', function(socket)	{
	// Opening Message to the user connections
	console.log('New connection established');
	socket.emit('message', {message: 'Welcome to Chat Mania', username: "Server", time: getDateString()});
	// logs number of clients

	redisClient.lrange("messages", 0, -1, function(err, messages) {
		messages.forEach(function(message) {
			socket.emit('message', message);
		});
	});
	

	//Listens for send event, emits to rest of sockets
	socket.on('send', function(data)	{
		io.sockets.emit('message', data);
			redisClient.lpush("messages", data, function(){
				redisClient.ltrim("messages", 0, 20);
			});
	});





});

console.log("Listening on port " + port);

function getDateString() {
 	var datetime = "Sent: " + (currentDate.getMonth()+1) + "/"
        + currentDate.getDate()  + "/" 
        + currentDate.getFullYear() + " @ "  
        + currentDate.getHours() + ":"  
        + currentDate.getMinutes() + ":" 
        + currentDate.getSeconds();
    return datetime;
}
