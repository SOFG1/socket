const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { join } = require("node:path");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for development (adjust as needed)
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  socket.on("session", (arg) => {
    //Start
    if (arg === "start") {
      io.emit("session", "start");
    }
    //Stop
    if (arg === "stop") {
      io.emit("session", "stop");
    }
  });
  //Connect mobile device
  socket.on("device", (d) => {
    io.emit("device", d);
  });
  // WebRTC below
  socket.on("offer", (data) => {
    console.log("Offer received:", data);
    socket.broadcast.emit("offer", data); // Send offer to other peer
  });

  socket.on("answer", (data) => {
    console.log("Answer received:", data);
    socket.broadcast.emit("answer", data); // Send answer to other peer
  });

  socket.on("ice-candidate", (data) => {
    console.log("ICE Candidate received:", data);
    socket.broadcast.emit("ice-candidate", data); // Send ICE candidate to other peer
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
