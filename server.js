const express = require('express');
const app = express();
var http = require('http').Server(app);
const socketIO = require('socket.io')(http);

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
var test = 0;


app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  res.sendFile(__dirname + '/public/index.html');
});
app.listen(app.get('port'), function() {
  console.log('listening on *:' + app.get('port'));
});
  const io = socketIO(http);

  io.on("connection", (socket)=>{
    console.log("ユーザーが接続しました");

    socket.on("shake", (nm)=>{
      io.emit("member-shake", nm);
    });
  });
