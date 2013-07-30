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
        if (name.value == "") {
            alert("Please type your name!");
        } else if (field.value == "") {
            field.setAttribute('placeholder', 'Please enter a message');
        } else {
            var text = field.value;
            var currentDate = new Date();
            var datetime = "Last Sync: " + (currentDate.getMonth()+1) + "/"
                + currentDate.getDate()  + "/" 
                + currentDate.getFullYear() + " @ "  
                + currentDate.getHours() + ":"  
                + currentDate.getMinutes() + ":" 
                + currentDate.getSeconds();

            socket.emit('send', { message: text, username: name.value, time: datetime});
            field.value = "";
            field.focus();
        }
    };
 
}