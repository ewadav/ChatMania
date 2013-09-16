// David F Ewald
// ChatMania
// The small real time chat application

var express = require('express');
var app = express();
var port = 3700;
var redis = require('redis');

//app.set('views', __dirname + '/tpl');
//app.set('view engine', "jade");
//app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.sendfile(__dirname + '/index.html');
});

//Setup Socket IO
var io = require('socket.io').listen(app.listen(port));

//Setup Redis
var redisClient = redis.createClient();

// List of usernames within client
var usernames = {};

// List of chartooms
var rooms = ['room1', 'room2', 'room3'];

// Listening to the connection of sockets
io.sockets.on('connection', function(socket)	{
	// Opening Message to the user connections
	console.log(socket.id + ': Connected to server');
	
	socket.on('addUser', function(username) {
		socket.username = username;
		socket.room = 'room1';
		usernames[username] = username;
		socket.join('room1');
		socket.emit('message', 'Server', 'You have connected to room1', getDateTimeString());
		socket.broadcast.to('room1').emit('message','Server', username + ' has connected to this room!', getDateTimeString());
		socket.emit('updateRooms', rooms, 'room1');
	})
	
	
	/*redisClient.lrange(socket.room, 0, -1, function(err, messages) {
		messages.forEach(function(message) {
			socket.emit('message', message);
		});
	}); */
	
	socket.on('switchRoom', function(newroom) {
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('message', 'Server', 'You have connected to' + newroom, getDateTimeString());
		socket.broadcast.to(socket.room).emit('message', 'Server', socket.username + ' has left this room', getDateTimeString());
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('message', 'Server', socket.username + ' has joined this room', getDateTimeString());
		socket.emit('updateRooms', rooms, newroom);
	})
	
	//Listens for send event, emits to rest of sockets
	socket.on('send', function(message)	{
		io.sockets.in(socket.room).emit('message', socket.username, message, getDateTimeString());
		//	redisClient.lpush(socket.room, data, function(){
			//	redisClient.ltrim(socketRoom, 0, 20);
		//	});
	});
	
	socket.on('disconnect', function() {
		console.log(socket.id + ": Disconnected from server");
		delete usernames[socket.username];
		io.sockets.emit('updateUsers', usernames);
		io.sockets.in(socket.room).emit('message', 'Server', socket.username + ' has disconnected', getDateTimeString());
		socket.leave(socket.room);
	});

});

console.log("Listening on port " + port);

function getDateTimeString() {
    var currentDate = new Date();
    var datetime = "Sent: " + (currentDate.getMonth()+1) + "/"
        + currentDate.getDate()  + "/" 
        + currentDate.getFullYear() + " @ "  
        + currentDate.getHours() + ":"  
        + currentDate.getMinutes() + ":" 
        + currentDate.getSeconds(); 
    return datetime;
}
