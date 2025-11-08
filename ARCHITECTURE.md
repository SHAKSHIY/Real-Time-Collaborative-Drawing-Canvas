# Architecture
- Clients capture pointer events and start a stroke (start_stroke).
- Clients throttle and emit stroke_segment events with batches of points ~80ms.
- Server appends segments to an in-memory op-log and broadcasts stroke_segment to others.
- On end_stroke server finalizes the op, attaches meta (color,width,isEraser) and appends to operations.
- Undo pops last op on server -> server emits tombstone and full_state; clients re-render from op-log.

WebSocket messages:
- join {roomId, userName}
- full_state { operations, users }
- start_stroke { opId }
- stroke_segment { opId, points, meta }
- end_stroke { opId, meta }
- stroke { op }  // finalized op
- cursor { x, y } // server adds name/color
- undo / redo
- tombstone { opId }

Undo/Redo strategy:
- Server keeps undoStack & redoStack of ops. Undo pops last op -> remove from operations -> notify clients.
- Simple global semantics (last action across all users) — explain tradeoffs in interview.

Performance decisions:
- Throttle segment sending (80ms) to balance latency & bandwidth.
- Draw incremental segments for immediate feedback; server authoritative for final ops.