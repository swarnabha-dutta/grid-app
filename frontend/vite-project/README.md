# Real-Time Grid App

> A real-time collaborative grid where multiple users can claim cells and see updates instantly across all clients.

---

## Live Demo

*(Add your deployed link here)*

---

## Features

- Interactive 20×20 grid
- Real-time updates via WebSockets (Socket.IO)
- Multi-user support across tabs and browsers
- Conflict handling — no overwriting claimed cells
- Cooldown mechanism to prevent spam clicks
- Unique color per user session
- State synchronization across all clients

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), CSS |
| Backend | Node.js, Express, Socket.IO |

---

## Project Structure

```
grid-app/
├── src/              # React frontend
├── server/
│   ├── index.js      # Express + Socket.IO server
│   └── package.json
├── public/
├── package.json
└── README.md
```

---

## System Architecture

```
Client (React)
     │
     │  WebSocket (Socket.IO)
     ▼
Server (Node.js + Express)
     │
     ├── Validates cell claim
     ├── Updates grid (in-memory)
     └── Broadcasts update to all clients
```

---

## Event Flow

```
User Clicks Cell
     │
     ▼
Frontend emits → "claim-cell"
     │
     ▼
Server validates:
     ├── EMPTY  → update grid + broadcast "cell-updated"
     └── FILLED → emit "cell-rejected" to sender
     │
     ▼
All clients re-render with latest state
```

---

## How It Works

1. Each user is assigned a unique session ID and color
2. Clicking a cell emits a `claim-cell` event to the server
3. Server checks if the cell is available
4. If valid → updates in-memory grid and broadcasts to all clients
5. All connected clients re-render instantly

---

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-link>
cd grid-app
```

### 2. Install dependencies

```bash
# Frontend
npm install

# Backend
cd server
npm install
```

### 3. Run the application

```bash
# Start backend (from /server)
nodemon index.js

# Start frontend (from root)
npm run dev
```

### 4. Open in browser

```
http://localhost:5173
```

---

## Testing Multi-User Behavior

Open the app in multiple contexts simultaneously:

- Normal browser window
- Incognito window
- A different browser (e.g. Edge)

**Verify:**

- Real-time sync across all tabs
- Claimed cells cannot be overwritten
- State remains consistent after page refresh
- No console errors

---

## Design Decisions

| Decision | Reason | Trade-off |
|----------|--------|-----------|
| WebSockets (Socket.IO) | Real-time bidirectional updates | Persistent connections have overhead |
| In-memory grid | Simple and fast | Resets on server restart |
| Server as source of truth | Ensures consistency across clients | Slight latency per action |
| Broadcast to all clients | Simple implementation | Not optimal at scale |

---

## Concurrency Handling

- All cell claims are validated server-side
- First valid request wins; subsequent requests for the same cell are rejected
- Prevents race conditions in a multi-user environment

---

## Current Limitations

- Grid state is stored in memory — resets on server restart
- No authentication or persistent user identities
- Not optimized for large-scale or high-traffic scenarios

---

## Future Improvements

- Persistent storage with MongoDB or Redis
- Authentication and named user identities
- Leaderboard and stats system
- Zoom and pan support for larger grids
- Rate limiting and anti-spam measures
- Horizontal scaling with Redis adapter (Socket.IO)

---

## Key Learnings

- Real-time system design using WebSockets
- Handling concurrency and race conditions at the server level
- Maintaining consistent shared state across distributed clients
- Client-server architecture for collaborative applications

---

## Author

**Swarnabha Dutta**

- GitHub: [github.com/swarnabha-dutta](https://github.com/swarnabha-dutta)
- LinkedIn: [linkedin.com/in/swarnabha-dutta](https://www.linkedin.com/in/swarnabha-dutta)****