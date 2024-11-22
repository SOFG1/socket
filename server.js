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
});

server.listen(8000, () => {
  console.log("server running at http://localhost:3000");
});
