const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for development (adjust as needed)
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //Start
  socket.on("start", (d) => {
    io.emit("start", d);
  });
  //Stop
  socket.on("stop", (d) => {
    io.emit("stop", d);
  });
  //Settings
  socket.on("settings", (d) => {
    io.emit("settings", d);
  });
  //Signal
  socket.on("signal", (d) => {
    socket.broadcast.emit("signal", d);
  });
  //WebRTC bellow
  const arr = Array.from(io.sockets.sockets.keys());
  io.emit("connection-started", arr);
  // Handle disconnect
  socket.on("disconnect", () => {
    const arr = Array.from(io.sockets.sockets.keys());
    io.emit("connection-started", arr);
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
