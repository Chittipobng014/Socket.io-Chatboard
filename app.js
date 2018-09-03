var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.listen(3000);

var clients = {};

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.on('add-user', function(data){
    clients[data.username] = {
      "socket": socket.id
    };    
    console.log(clients);
  });

  socket.on('private-message', function(data){
    console.log("Sending: " + data.content + " from " + data.from + " to " + data.username);
    if (clients[data.username]){
      io.sockets.connected[clients[data.username].socket].emit("add-message", data);
    } else {
      console.log("User does not exist: " + data.username); 
    }
  });

  //Removing the socket on disconnect
  socket.on('disconnect', function() {
  	for(var name in clients) {
  		if(clients[name].socket === socket.id) {
  			delete clients[name];
  			break;
  		}
    }    
    console.log(clients);	
  })

});



