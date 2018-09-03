var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cors = require('cors');
var fs = require('fs')

app.listen(process.env.PORT || 8080);

var clients = {};

app.use(cors())
app.use(express.static(__dirname + "/static"));

app.get('/', function (req, res) {
  res.sendFile(__dirname + 'static/index.html');
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



