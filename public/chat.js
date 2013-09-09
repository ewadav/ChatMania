// David F Ewald
// ChatMania
// The small real time chat application

window.onload = function() {
    var userName;
    
    
    var socket = io.connect('http://localhost:3700');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
    var userList = document.getElementById('userList');
     
    userName = prompt("Please Enter Your Username", "");
    socket.emit('setUsername', userName);
    
    socket.on('message', function(data) {
        if(data.message) {
            $('#content').append(data.username + ": " + data.message + " "  + data.time + "<br>");
        } else {
            console.log("There is a problem:", data);
        }
    });
    
    socket.on('updateUserlist', function(sockets) {
        userList.empty();
        sockets.forEach(function(socket) {
             userList.append(socket.username);
         });
    });
    
    socket.on('roomDisconnect', function(username) {
        $(#content).append(username + " has disconnected!");
    });
 
    
 
    sendButton.onclick = function() {
         socket.emit('send', { message: field.value, username: userName, time: getCurrentTimeString()});
         field.value = "";
         field.focus();
    };
    
    function getCurrentTimeString() {
        var datetimeString = "Sent: " + (currentDate.getMonth()+1) + "/"
                + currentDate.getDate()  + "/" 
                + currentDate.getFullYear() + " @ "  
                + currentDate.getHours() + ":"  
                + currentDate.getMinutes() + ":" 
                + currentDate.getSeconds(); 
        return datetimeString;
    }
 
}
