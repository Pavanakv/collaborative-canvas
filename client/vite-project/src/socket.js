import { io } from "socket.io-client";

export const socket = io("https://collaborative-canvas-3n2b.onrender.com", {
  transports: ["websocket"]
});
