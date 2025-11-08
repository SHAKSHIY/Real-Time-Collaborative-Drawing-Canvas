# Collaborative Real-Time Drawing Canvas

A **multi-user real-time collaborative drawing application** built using **Vanilla JavaScript**, **HTML5 Canvas**, and **Node.js with Socket.io**.

Multiple users can draw simultaneously on the same shared canvas with **real-time synchronization**, **global undo/redo**, and **live user indicators** — all without using any frontend frameworks.

---

## Features

### Drawing Tools
- Brush with adjustable **color** and **stroke width**
- **Eraser tool** for removing strokes
- **Undo/Redo** (works globally for all users)
- Smooth **path rendering** for real-time drawing

### Real-time Collaboration
- Multiple users can draw **simultaneously**
- **Instant synchronization** of strokes across clients
- **User cursors** show where each user is drawing
- Handles **overlapping strokes** gracefully (no flicker/conflict)

### 👥 User Management
- Shows **who is online**
- Each user gets a **unique color**
- Cursor labels show the **username** and **color border**

### Global State
- Server maintains an **authoritative operation log**
- **Global Undo/Redo** managed across all clients
- **Conflict-safe** real-time updates

### Bonus Features
- Gooey modern toolbar (color picker, eraser, undo/redo)
- **Touchscreen / stylus** support (via Pointer events)
- Fully responsive across devices

---

## Tech Stack

| Component | Technology |
|------------|-------------|
| **Frontend** | Vanilla JavaScript, HTML5 Canvas, CSS |
| **Backend** | Node.js, Express, Socket.io |
| **Protocol** | WebSocket (real-time bi-directional communication) |
| **Deployment** | Works locally and deployable on Render/Heroku |

---

## 📁 Folder Structure

<img width="232" height="480" alt="image" src="https://github.com/user-attachments/assets/a386413d-9c30-4f29-b80a-ba9f61d4ec9e" />


---

## ⚙️ Setup & Installation

### 1️. Clone the repository
```bash
git clone https://github.com/SHAKSHIY/Real-Time-Collaborative-Drawing-Canvas.git
cd collaborative-canvas

### 2. Install dependencies
```bash
npm install

### 3. Run the server
```bash
npm start

### 4. Open the app

Open http://localhost:3000 in your browser.

To test multi-user functionality:

- Open multiple tabs or browsers

- Enter different usernames

- Start drawing!

## Testing Instructions

- Draw from two or more browser windows.

- Change colors, brush width, or toggle the eraser.

- Use Undo/Redo — it will update globally.

- Observe user names and colors appearing live.

## Author

Shakshi Yadav
B.Tech, IIT Patna
