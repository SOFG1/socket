const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for development (adjust as needed)
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Signaling server is running");
});

io.on("connection", (socket) => {
  console.log("New connection: ", socket.id);

  // Handle signaling messages (offer, answer, ICE candidates)
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

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Signaling server listening on port 3000");
});
