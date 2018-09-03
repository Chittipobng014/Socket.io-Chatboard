var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cors = require('cors');
var fs = require('fs')

app.listen(process.env.PORT || 8080);

var clients = {};

app.use(cors())

app.get('/', function (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
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



