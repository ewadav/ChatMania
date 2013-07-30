// David F Ewald
// ChatMania
// The small real time chat application

window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://localhost:3700');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
    var currentDate = new Date();
 
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
                if(messages[i].time !=undefined)    {
                    html += '<small>' + messages[i].time + '</small>' + '<br />';
                }
            }
            content.innerHTML = html;
            content.scrollTop = content.scrollHeight;
        } else {
            console.log("There is a problem:", data);
        }
    });
 
    sendButton.onclick = function() {
        if(name.value == "") {
            alert("Please type your name!");
        } else {
            var text = field.value;
            var datetime = "Last Sync: " + currentDate.getDate() + "/"
                + (currentDate.getMonth()+1)  + "/" 
                + currentDate.getFullYear() + " @ "  
                + currentDate.getHours() + ":"  
                + currentDate.getMinutes() + ":" 
                + currentDate.getSeconds();

            socket.emit('send', { message: text, username: name.value, time: datetime});
            field.value = "";
        }
    };
 
}