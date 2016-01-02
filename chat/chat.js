var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('redis');
var redisClient = redis.createClient();

// client.set("message1", "hello, yes this is dog");
// client.set("message2", "hello, no this is spider");

// var mdog = "Hello, this is dog";
// client.lpush("messages", mdog, function(err, reply) {
//   console.log(reply);
// });

var messages = [];
var storeMessage = function(name, data) {
  var message = JSON.stringify({name: name, data: data});
redisClient.lpush ("messages", message, function(err, response) {
  if (err) {
    console.log(err);
  }
  console.log("Database stored at: " + response);
  redisClient.ltrim("messages", 0, 9);
})

  messages.push({name: name, data: data});
  if (messages.length > 10) {
    messages.shift();
  }
};


io.on('connection', function(socket){
socket.on('join', function(name) {
  socket.nickname = name;
  redisClient.lrange("messages", 0, -1, function(err, messages) {
    if(err) {
      console.log(err);
    }
    messages = messages.reverse();
  }

  messages.forEach(function(message) {
    message = JSON.parse(message);
    socket.emit("chat message", message.name + ": " + message.data);
  })
});
  console.log('a user connected');
 socket.on('disconnect', function(){
   console.log('user disconnected');
 });
  socket.on('chat message', function(msg){
    var nickname = socket.nickname;
  socket.broadcast.emit('chat message', nickname + ": " + msg);
  socket.emit('chat message', nickname + ": " + msg);
  storeMessage(nickname, msg);
});
});
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/socket.html');
});
server.listen(8080);
