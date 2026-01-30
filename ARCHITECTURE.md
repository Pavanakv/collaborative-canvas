# Architecture – Real-Time Collaborative Drawing Canvas

## Overview
This application is a real-time collaborative drawing tool where multiple users
can draw simultaneously on a shared canvas. It uses WebSockets to synchronize
drawing actions across all connected clients.

## System Architecture
- Client: React (Vite) + HTML5 Canvas
- Server: Node.js + Socket.io
- Communication: WebSockets

## Data Flow
1. User interacts with canvas (mouse/touch events)
2. Drawing data is serialized as stroke objects
3. Stroke events are sent to the server via Socket.io
4. Server broadcasts events to other connected clients
5. Clients render strokes on the canvas in real time

## Real-Time Synchronization
The server acts as the authoritative source of truth. Clients optimistically
render strokes for responsiveness while synchronizing state through server
broadcasts.

## Undo / Redo Strategy
Undo and redo operations are handled on the server using a global stroke history
stack. When an undo or redo occurs, the updated canvas state is broadcast to all
clients to maintain consistency.

## Conflict Resolution
Simultaneous drawing conflicts are resolved naturally by treating each stroke as
an atomic operation and redrawing strokes in order.

## Performance Considerations
- Lightweight stroke serialization
- Minimal canvas redraws
- WebSocket-only transport for low latency
