// David F Ewald
// ChatMania
// The small real time chat application

    //http://psitsmike.com/2011/10/node-js-and-socket-io-multiroom-chat-tutorial/
    var socket = io.connect('http://localhost:3700');
    
     
    
    
    socket.on('message', function(message, username, timeString) {
        if(message) {
            $('#content').append("<b>" + username + ": </b>" + message + " "  + timeString + "<br>");
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
    
 
 window.onload = function() {   
 
    sendButton.onclick = function() {
         socket.emit('send', { message: field.value, username: userName, time: getCurrentTimeString()});
         field.value = "";
         field.focus();
    };
}

 function getCurrentTimeString() {
        var datetimeString = "Sent: " + (currentDate.getMonth()+1) + "/"
                + currentDate.getDate()  + "/" 
                + currentDate.getFullYear() + " @ "  
                + currentDate.getHours() + ":"  
                + currentDate.getMinutes() + ":" 
                + currentDate.getSeconds(); 
        return datetimeString;
    }
