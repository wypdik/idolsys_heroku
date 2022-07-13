const crypto = require('crypto');
const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
var member_name_array = [];
var member_id_array= [];
var member_color_array= [];

const server = express()
.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
.listen(PORT, () => console.log(`Listening on ${PORT}`));

var app = express()
app.use(express.static(__dirname + '/public'));

const io = socketIO(server);

io.on("connection", (socket)=>{

  console.log("ユーザーが接続しました");
  (()=>{
    // トークンを作成
    const token = makeToken(socket.id);

    // 本人にトークンを送付
    io.to(socket.id).emit("token", {token:token});
  })();
  socket.on("name_sending", (nm)=>{
    member_name_array[member_name_array.length] = nm;
    member_id_array[member_id_array.length]=socket.id;
    member_color_array[member_color_array.length]=0;
    console.log(nm);
    console.log("test");
    console.log(member_name_array);
    io.emit("member-name-sending", member_name_array,member_id_array,member_color_array);
  });
  socket.on("color_sending", (cl,nm)=>{
    member_color_array[nm] = cl;
    io.emit("member-color-sending", cl,nm);
  });
  socket.on("shake", (nm,ttoken,x_acceleration,max)=>{
    io.emit("member-shake", nm,ttoken,x_acceleration,max);
  });
  socket.on("disconnect",(reason)=> {
    var disconnect_id = member_id_array.indexOf(socket.id);
    member_name_array.splice(disconnect_id,1);
    member_id_array.splice(disconnect_id,1);
    io.emit("member_disconnect", socket.id);
  });
});


function makeToken(id){
  const str = "qawsedrftgyhujiko" + id;
  return( crypto.createHash("sha1").update(str).digest('hex') );
}
