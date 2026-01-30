const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

/* ===============================
   GLOBAL SHARED STATE (IMPORTANT)
   =============================== */
const strokes = [];      // committed strokes
const redoStack = [];    // undone strokes
const users = {};        // connected users

/* ===============================
   SOCKET CONNECTION
   =============================== */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  /* ---- USER MANAGEMENT ---- */
  users[socket.id] = true;
  io.emit("users", Object.keys(users));

  // send full history to new user
  socket.emit("history", strokes);

  /* ---- DRAWING EVENTS ---- */
  socket.on("stroke:move", (data) => {
    socket.broadcast.emit("stroke:move", data);
  });

 socket.on("stroke:start", stroke => {
  strokes.push(stroke);
  redoStack.length = 0;
  io.emit("stroke:start", stroke);
});

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


  /* ---- CURSOR TRACKING ---- */
  socket.on("cursor", (pos) => {
    socket.broadcast.emit("cursor", {
      id: socket.id,
      pos
    });
  });

  /* ---- DISCONNECT ---- */
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    delete users[socket.id];
    io.emit("users", Object.keys(users));
    io.emit("cursor:remove", socket.id);
  });
});

socket.on("cursor", (pos) => {
  socket.broadcast.emit("cursor", {
    id: socket.id,
    pos
  });
});

socket.on("disconnect", () => {
  io.emit("cursor:remove", socket.id);
});

/* ===============================
   START SERVER
   =============================== */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on", PORT);
});
