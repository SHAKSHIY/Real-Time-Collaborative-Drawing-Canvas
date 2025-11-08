
---

## **ARCHITECTURE.md**


# System Architecture — Collaborative Drawing Canvas

---

## Overview
The application is a **real-time collaborative drawing system** that enables multiple users to draw simultaneously on a shared canvas using **Socket.io** for bi-directional communication.

It consists of:
1. A **Canvas-based frontend** for drawing.
2. A **WebSocket backend** for real-time event handling.
3. A **room-based state manager** for synchronization, undo/redo, and user management.

---

## Data Flow Diagram

[ User Action ] ->
[ Canvas Events ] → (client/canvas.js) ->
[ Socket.io emit ] → start_stroke / stroke_segment / end_stroke ->
[ Server (server.js) ]
├─ updates DrawingState (rooms.js + drawing-state.js)
─ broadcasts → stroke_segment / stroke / cursor / full_state ->
[ Other Clients receive update ] ->
[ Draw live updates on Canvas ]


---

## WebSocket Protocol

| Event | Direction | Description |
|--------|------------|-------------|
| `join` | Client → Server | User joins a room with name and roomId |
| `start_stroke` | Client → Server | User begins a stroke (creates op) |
| `stroke_segment` | Client ↔ Server | Streams stroke segments (real-time drawing) |
| `end_stroke` | Client → Server | Ends current stroke, finalizes operation |
| `undo` / `redo` | Client ↔ Server | Performs global undo/redo |
| `cursor` | Client ↔ Server | Shares live cursor positions |
| `full_state` | Server → Client | Sends entire canvas state (used on join/undo/redo) |
| `users` | Server → Client | Broadcasts current online users |

---

## Undo/Redo Strategy
- Each drawing action is stored as an **operation (op)** on the server.
- **Undo**: Pops the latest op from the active stack → pushes to redo stack.
- **Redo**: Pops from redo stack → re-applies to ops stack.
- Server re-broadcasts the entire updated canvas state via `full_state` to ensure all clients stay in sync.

---

## Performance Decisions

| Challenge | Optimization |
|------------|---------------|
| High-frequency events | Used throttled stroke streaming instead of per-pixel sends |
| Network latency | Draws locally while emitting segments for smooth UX |
| Redraw efficiency | Only redraws new segments instead of full canvas |
| Global consistency | Server authoritative model ensures identical state across clients |

---

## Conflict Resolution
- Each stroke is **independent and composited** via `source-over` blending.
- Concurrent strokes don’t overwrite each other — they are merged visually.
- The server’s **op-log ordering** ensures deterministic playback for all users.

---

## State Management
Each room maintains:
```js
{
  users: [{ id, name, color }],
  drawing: {
    ops: [ { id, type, stroke } ],
    redoStack: []
  }
}
