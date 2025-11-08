# 🎨 Collaborative Real-Time Drawing Canvas

A **multi-user real-time collaborative drawing application** built using **Vanilla JavaScript**, **HTML5 Canvas**, and **Node.js with Socket.io**.

Multiple users can draw simultaneously on the same shared canvas with **real-time synchronization**, **global undo/redo**, and **live user indicators** — all without using any frontend frameworks.

---

## 🚀 Features

### 🖌️ Drawing Tools
- Brush with adjustable **color** and **stroke width**
- **Eraser tool** for removing strokes
- **Undo/Redo** (works globally for all users)
- Smooth **path rendering** for real-time drawing

### ⚡ Real-time Collaboration
- Multiple users can draw **simultaneously**
- **Instant synchronization** of strokes across clients
- **User cursors** show where each user is drawing
- Handles **overlapping strokes** gracefully (no flicker/conflict)

### 👥 User Management
- Shows **who is online**
- Each user gets a **unique color**
- Cursor labels show the **username** and **color border**

### 🧠 Global State
- Server maintains an **authoritative operation log**
- **Global Undo/Redo** managed across all clients
- **Conflict-safe** real-time updates

### 🎁 Bonus Features
- Gooey modern toolbar (color picker, eraser, undo/redo)
- **Touchscreen / stylus** support (via Pointer events)
- Fully responsive across devices

---

## 🧩 Tech Stack

| Component | Technology |
|------------|-------------|
| **Frontend** | Vanilla JavaScript, HTML5 Canvas, CSS |
| **Backend** | Node.js, Express, Socket.io |
| **Protocol** | WebSocket (real-time bi-directional communication) |
| **Deployment** | Works locally and deployable on Render/Heroku |

---

## 📁 Folder Structure

