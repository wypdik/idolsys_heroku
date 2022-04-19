const crypto = require('crypto');
const app = require('express')();
const http = require("http").createServer(app);
const socketIO = require('socket.io')(http);

// HTMLやJSなどを配置するディレクトリ
const DOCUMENT_ROOT = __dirname + "/public";

app.get("/", (req, res)=>{
  res.sendFile(DOCUMENT_ROOT + "/index.html");
});
app.get("/:file", (req, res)=>{
  res.sendFile(DOCUMENT_ROOT + "/" + req.params.file);
});


const io = socketIO(http);

io.on("connection", (socket)=>{
  console.log("ユーザーが接続しました");

  //---------------------------------
  // ログイン
  //---------------------------------
  (()=>{
    // トークンを作成
    const token = makeToken(socket.id);

    // 本人にトークンを送付
    io.to(socket.id).emit("token", {token:token});
  })();

  socket.on("shake", (nm)=>{
    io.emit("member-shake", nm);
  });
});

http.listen(3000, ()=>{
  console.log("listening on *:3000");
});

/**
* トークンを作成する
*
* @param  {string} id - socket.id
* @return {string}
*/
function makeToken(id){
  const str = "aqwsedrftgyhujiko" + id;
  return( crypto.createHash("sha1").update(str).digest('hex') );
}
