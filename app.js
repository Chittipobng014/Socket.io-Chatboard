var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cors = require('cors');
var router = require('./routes')
var bodyParser = require('body-parser')

http.listen(process.env.PORT || 8080);

var clients = {};

app.use(bodyParser.json());
app.use(cors())
app.use('/static', express.static('public'))
app.use('/api', router)

io.sockets.on('connection', function (socket) {
  socket.on('add-user', function (data) {
    clients[data.username] = {
      "socket": socket.id
    };
  });

  socket.on('subscribe', function (data) {
    var id = data.pageid += data.branchid
    console.log(id + ' Subscribed!');
    clients[id] = {
      "socket": socket.id
    }
  })

  socket.on('send-order', function (data) {
    var id = data.pageid += data.branchid
    console.log('new order is sending to: ' + id);
    if (clients[id]) {
      io.sockets.connected[clients[id].socket].emit('incoming-order', data)
    } else {
      console.log('Client is not connected');      
    }
  })

  socket.on('private-message', function (data) {
    console.log("Sending: " + data.content + " from " + data.from + " to " + data.username);
    if (clients[data.username]) {
      io.sockets.connected[clients[data.username].socket].emit("add-message", data);
    } else {
      console.log("User does not exist: " + data.username);
    }
  });

  //Removing the socket on disconnect
  socket.on('disconnect', function () {
    for (var name in clients) {
      if (clients[name].socket === socket.id) {
        delete clients[name];
        break;
      }
    }
  })
});



