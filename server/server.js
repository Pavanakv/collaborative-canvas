const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

/* ===============================
   GLOBAL STATE
   =============================== */
const strokes = [];
const redoStack = [];
const users = {};

/* ===============================
   SOCKET HANDLING
   =============================== */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  users[socket.id] = true;
  io.emit("users", Object.keys(users));

  socket.emit("history", strokes);

  // DRAWING
  socket.on("stroke:start", (stroke) => {
    strokes.push(stroke);
    redoStack.length = 0;
    socket.broadcast.emit("stroke:start", stroke);
  });

  socket.on("stroke:move", (data) => {
    socket.broadcast.emit("stroke:move", data);
  });

  // UNDO / REDO
  socket.on("undo", () => {
    if (!strokes.length) return;
    redoStack.push(strokes.pop());
    io.emit("history", strokes);
  });

  socket.on("redo", () => {
    if (!redoStack.length) return;
    strokes.push(redoStack.pop());
    io.emit("history", strokes);
  });

  // CURSOR
  socket.on("cursor", (pos) => {
    socket.broadcast.emit("cursor", {
      id: socket.id,
      pos
    });
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", Object.keys(users));
    io.emit("cursor:remove", socket.id);
  });
});

/* ===============================
   START SERVER
   =============================== */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
