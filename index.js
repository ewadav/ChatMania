// David F Ewald
// ChatMania
// The small real time chat application

var express = require("express");
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
		socket.emit('message', 'You have connected to room1', 'Server', getDateTimeString());
		socket.broadcast.to('room1').emit('message', username + ' has connected to this room!', 'Server', getDateTimeString());
		socket.emit('updateRooms', rooms, 'room1');
	})
	
	
	// logs number of clients
	var room = 'Skinny T';
	socket.join(room);
	socket.set('room', room, function(){
		//nothing here yet bbut socket room is set
	});
	
	socket.on('setUsername', function(name) {
		socket.set('username', name, function() {
			io.sockets.in(room).emit('updateUserlist', io.sockets.clients(room)); //updates userList in room
		});
	});
	
	redisClient.lrange(socket.get('room',function(){}), 0, -1, function(err, messages) {
		messages.forEach(function(message) {
			socket.emit('message', message);
		});
	});
	
	//Listens for send event, emits to rest of sockets
	socket.on('send', function(data)	{
		var socketRoom = socket.get('room',function(){});
		io.sockets.in(socketRoom).emit('message', data);
			redisClient.lpush(socketRoom, data, function(){
				redisClient.ltrim(socketRoom, 0, 20);
			});
	});
	
	socket.on('disconnect', function() {
		console.log(socket.id + ": Disconnected from server");
		io.sockets.in(socket.room).emit('roomDisconnect', socket.username);
		io.sockets.in(socket.room).emit('updateUserlist', io.sockets.clients(room));
	});

});

console.log("Listening on port " + port);

function getDateTimeString() {
    var datetime = "Sent: " + (currentDate.getMonth()+1) + "/"
        + currentDate.getDate()  + "/" 
        + currentDate.getFullYear() + " @ "  
        + currentDate.getHours() + ":"  
        + currentDate.getMinutes() + ":" 
        + currentDate.getSeconds();
    return datetime;
}
