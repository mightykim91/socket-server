const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.json({message: "Welcome"})
})

app.get('/:roomId/:userId/', (req, res) => {
    res.render('call', {roomId: "a"+req.params.roomId+"a" , userId: req.params.userId})
})

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

const rooms = []

io.on('connection', (socket) => {
    //채팅방 접속
    console.log('socket.io connected')
    socket.on('join', (roomId, userId) => {
        socket.join(roomId, () => {
            msg = userId + " 님이 방에 접속했습니다.";
            if (!roomId in rooms) {
              rooms.push(roomId);
            }
            console.log("서버사이드", roomId, userId, msg)
            socket.to(roomId).broadcast.emit('user-connected', userId, msg);
        })
    })

    //채팅방 나가기
    socket.on('leave', (roomId, userId) => {
        socket.leave(roomId, () => {
            msg = userId + " 님이 방에서 나갔습니다."
            io.to(roomId).emit('leave', userId, msg)
        })
    })

    //채팅
    socket.on('chat', (roomId, userId, chat) => {
        io.to(roomId).emit('chat', userId, chat)
    })
})


server.listen(3000)
