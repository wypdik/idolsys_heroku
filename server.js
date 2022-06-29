const crypto = require('crypto');
const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
var member_count_server = 0;
var member_name_array = [];
var member_id_array= [];

const server = express()
.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
.listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on("connection", (socket)=>{
  member_count_server ++;
  member_id_array[member_id_array.length]=socket.id;
  console.log("ユーザーが接続しました");

  (()=>{
    // トークンを作成
    const token = makeToken(socket.id);

    // 本人にトークンを送付
    io.to(socket.id).emit("token", {token:token});
  })();
  socket.on("name_sending", (nm)=>{
    member_name_array[member_name_array.length] = nm;
    console.log(nm);
    console.log("test");
    console.log(member_name_array);
    io.emit("member-name-sending", member_name_array,member_count_server);
  });
  socket.on("color_sending", (cl,nm)=>{
    io.emit("member-color-sending", cl,nm);
  });
  socket.on("shake", (nm,ttoken)=>{
    io.emit("member-shake", nm,ttoken);
  });
});


function makeToken(id){
  const str = "qawsedrftgyhujiko" + id;
  return( crypto.createHash("sha1").update(str).digest('hex') );
}
