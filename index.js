// David F Ewald
// ChatMania
// The small real time chat application

var express = require("express");
var app = express();
var port = 3700;

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);cd

app.get("/",  function(req, res){
	res.render("page");
})

app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function(socket)	{
	sockets.emit('message', {message: 'Welcome to Chat Mania'});
	sockets.on('send', function(data)	{
		io.sockets.emit('message', data);
	});
});

console.log("Listening on port " + port);