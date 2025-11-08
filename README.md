# Collaborative Canvas

## Setup
npm install
npm start
Open http://localhost:3000 in 2+ browser windows.

## Features
- Brush, Eraser, Color, Stroke width
- Real-time streaming (see others while they draw)
- Global Undo/Redo (server-authoritative)
- User cursors with assigned colors and names
- Touch support

## How to test multi-user
Open two or more browsers/incognito, enter different names. Draw — strokes stream in real time.

## Known limitations
- In-memory operation log (no persistence). Can add Redis or snapshot persistence.
- Global undo is last-action global (any user can undo last stroke).