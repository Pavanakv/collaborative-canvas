# 🎨 Real-Time Collaborative Drawing Canvas 

A real-time multi-user drawing application where multiple users can draw
simultaneously on a shared canvas with live synchronization using WebSockets.

This project was built as part of a technical assignment to demonstrate
real-time system design, Canvas API proficiency, and WebSocket-based state
synchronization.

---

## 🚀 Live Demo

- **Frontend:** https://collaborative-canvas-2ux557tbo-pavana-k-vs-projects.vercel.app/  
- **Backend:** https://collaborative-canvas-3n2b.onrender.com

> Open the frontend link in two different browsers or incognito windows
to test real-time collaboration.

---

## 🛠 Tech Stack

- **Frontend:** React (Vite), HTML5 Canvas API
- **Backend:** Node.js, Socket.io
- **Real-Time Communication:** WebSockets
- **Deployment:**
  - Frontend → Vercel
  - Backend → Render

---

## ✨ Features

- Real-time multi-user drawing
- Brush and eraser tools
- Color selection
- Adjustable stroke width
- Live cursor indicators for connected users
- Online user list
- Global undo and redo (server-authoritative)
- No external canvas or drawing libraries used

---

## 📐 Architecture Overview

The application follows a client-server architecture:

- Clients capture drawing events from the canvas
- Drawing actions are serialized as stroke objects
- Events are sent to the server via Socket.io
- The server acts as the authoritative source of truth
- Updates are broadcast to all connected clients in real time
- Undo/redo operations are handled globally on the server

A detailed explanation is available in **ARCHITECTURE.md**.

---

## 🧪 How to Test Locally

### Backend
```bash
cd server
npm install
npm start
```

### Frontend

```bash
cd client/vite-project
npm install
npm run dev


Open http://localhost:5173 in two browsers and start drawing.
```

### 🌐 How to Test the Live Version

Open the live frontend URL in two different browsers

Draw on the canvas in one browser

Observe real-time drawing updates in the other

Move the cursor to see live cursor indicators

Test undo/redo:

Ctrl + Z → Undo

Ctrl + Y → Redo


### ⚠️ Known Limitations

Undo/redo is stroke-based and may exhibit edge cases during heavy concurrent usage

Drawing state is stored in memory and resets when the server restarts

Cursor indicators are basic and can be enhanced with user-specific colors

No authentication is implemented (not required for this assignment)```

## 📂 Project Structure

collaborative-canvas/
├── client/
│ └── vite-project/
│ ├── src/
│ ├── index.html
│ ├── package.json
│ └── vite.config.js
├── server/
│ ├── server.js
│ └── package.json
├── README.md
└── ARCHITECTURE.md```

### 📌 Notes

This project focuses on:

Real-time collaboration

Canvas performance optimization

WebSocket-based event synchronization

Global state management for shared drawing history

The goal was to prioritize correctness, clarity, and system design over
over-engineering.```

### 🙌 Author

Pavana K.V
