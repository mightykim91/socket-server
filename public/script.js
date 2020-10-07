const socket = io('http://localhost:3000')
const myPeer = new Peer(userId, {
    host: 'j3a405.p.ssafy.io',
    port: 9000,
    path: '/myapp',
    // debug: 3,
})

const chatBox = document.querySelector('#chat-box')

myPeer.on('open', id => {
    console.log("피어 생성", roomId, userId)
    socket.emit('join', roomId, userId)
})


socket.on('chat', (userId, msg) => {
    this.messages.push(`${userId}: ${msg}`)
})


const panel = document.querySelector('#video-panel')
const myVideo = document.createElement('video')

myVideo.muted = true

const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        console.log('we got a call')
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId, msg) => {
        console.log('incoming message')
        connectToUser(userId, stream)
        console.log(msg)
        const message = document.createElement('p')
        message.innerText = msg
        chatBox.appendChild(message)
    })
})

socket.on('leave', (userId, msg) => {
    if (peers[userId]) {
        peers[userId].close()
    }
    this.messages.push(msg)
})

function connectToUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    console.log("calling to " + userId)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    panel.append(video)
}