const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { join } = require("node:path");

let newSpeed = "3000";
let speed = "3000";
let interval;

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
  //Session
  socket.on("session", (arg) => {
    if (arg === "start") {
      if (speed !== newSpeed) {
        clearInterval(interval);
        speed = newSpeed;
      }
      io.emit("session", "start");
      interval = setInterval(() => {
        io.emit("session", "start");
      }, Number(speed));
    }
    if (arg === "stop") {
      console.log(123);
      io.emit("session", "stop");
      clearInterval(interval);
    }
  });
  //Settings
  socket.on("settings", (arg) => {
    newSpeed = arg.speed;
    io.emit("settings", arg);
  });
});

server.listen(8000, () => {
  console.log("server running at http://localhost:3000");
});
