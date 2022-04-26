const crypto = require('crypto');
const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
var test = 0;

const server = express()
.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
.listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on("connection", (socket)=>{
  console.log("ユーザーが接続しました");

  (()=>{
    // トークンを作成
    const token = makeToken(socket.id);

    // 本人にトークンを送付
    io.to(socket.id).emit("token", {token:token});
  })();
  socket.on("shake", (nm,ttoken)=>{
    io.emit("member-shake", nm,ttoken);
  });
});


function makeToken(id){
  const str = "qawsedrftgyhujiko" + id;
  return( crypto.createHash("sha1").update(str).digest('hex') );
}
