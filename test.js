// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cron = require("node-cron");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: true, // Update this with your frontend origin if needed
//     methods: ["GET", "POST"],
//   },
// });

// // Set up a cron job to emit a socket event at 5 PM every day
// cron.schedule("55 21 * * *", () => {
//   io.emit("call_event", "It's 5 PM. Time to start the call!");
// });

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("offer", (data) => {
//     socket.broadcast.emit("offer", data);
//   });

//   socket.on("answer", (data) => {
//     socket.broadcast.emit("answer", data);
//   });

//   socket.on("candidate", (data) => {
//     socket.broadcast.emit("candidate", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


var cron = require("node-cron");

var task = cron.schedule("* * * * *", () => {
  console.log("will execute every minute until stopped");
});
task
// task.stop();