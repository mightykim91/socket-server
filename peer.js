const fs = require("fs");
const { PeerServer } = require("peer");

const peerServer = PeerServer({
  port: 9000,
  ssl: {
    key: fs.readFileSync("/etc/letsencrypt/live/j3a405.p.ssafy.io/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/j3a405.p.ssafy.io/cert.pem"),
  },
});

