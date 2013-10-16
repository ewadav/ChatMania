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
// var redisClient = redis.createClient();


// List of chartooms
var rooms = ['room1', 'room2', 'room3'];

//List of users
var roomUsers = {
	'room1' : [],
	'room2' : [],
	'room3' : []
};

// Listening to the connection of sockets
io.sockets.on('connection', function(socket)	{
	// Opening Message to the user connections
	console.log(socket.id + ': Connected to server');
	
	socket.on('addUser', function(username) {
		socket.username = username;
		socket.room = 'room1';
		socket.join('room1');
		roomUsers.room1.push(username);
		socket.emit('message', 'Server', 'You have connected to room1', getDateTimeString());
		socket.broadcast.to('room1').emit('message','Server', username + ' has connected to this room!', getDateTimeString());
		socket.emit('updateRooms', rooms, 'room1');
		io.sockets.in(socket.room).emit('updateUsers', roomUsers[socket.room]);
	})
	
	
	/*redisClient.lrange(socket.room, 0, -1, function(err, messages) {
		messages.forEach(function(message) {
			socket.emit('message', message);
		});
	}); */
	
	socket.on('switchRoom', function(newroom) {
		removeUser(socket.room, socket.username);
		socket.broadcast.to(socket.room).emit('updateUsers', roomUsers[socket.room]);
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('message', 'Server', 'You have connected to' + newroom, getDateTimeString());
		socket.broadcast.to(socket.room).emit('message', 'Server', socket.username + ' has left this room', getDateTimeString());
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('message', 'Server', socket.username + ' has joined this room', getDateTimeString());
		roomUsers[newroom].push(socket.username);
		socket.emit('updateRooms', rooms, newroom);
		io.sockets.in(socket.room).emit('updateUsers', roomUsers[socket.room]);
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
		removeUser(socket.room, socket.username);
		io.sockets.in(socket.room).emit('message', 'Server', socket.username + ' has disconnected', getDateTimeString());
		socket.broadcast.to(socket.room).emit('updateUsers', roomUsers[socket.room]);
		socket.leave(socket.room);
	});

});

console.log("Listening on port " + port);


//Helper Methods VVVVVVVV

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

function removeUser(oldRoom, username) {
	for(var i = roomUsers[oldRoom].length - 1; i >= 0; i--) {
	    if(roomUsers[oldRoom][i] === username) {
	       roomUsers[oldRoom].splice(i, 1);
	    }
	}
}
