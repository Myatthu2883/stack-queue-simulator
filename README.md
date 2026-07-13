# Stack & Queue Simulator 

An interactive simulator for two foundational data structures — **Stack (LIFO)** and **Queue (FIFO)** — with real-time animations, a bonus balanced parentheses checker, and a hot potato simulation. Built with **Next.js 15 (App Router)** and **React 18**.

---

## Features

- **Three view modes** — Stack only, Queue only, or side-by-side comparison
- **Stack operations** — Push, Pop, Peek, Clear, Load sample
- **Queue operations** — Enqueue, Dequeue, Peek, Clear, Load sample
- **Bonus: Balanced parentheses checker** — Classic stack algorithm (`{[()]}`)
- **Bonus: Hot Potato simulation** — Classic queue algorithm
- **Operation log** — Full history of every operation with color-coded output
- **Real-world use cases** — Displayed per data structure
- **Big-O complexity chips** — Live reference per active structure
- Dark monospace aesthetic with smooth animations

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Framework  | Next.js 15 App Router   |
| UI         | React 18 (hooks only)   |
| Styling    | CSS Modules             |
| DS Logic   | Vanilla JS OOP classes  |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── layout.jsx          # Root layout + IBM Plex Mono font
│   ├── page.jsx            # Home route
│   └── globals.css         # Dark theme CSS variables
├── components/
│   ├── Simulator.jsx               # Main interactive component
│   └── Simulator.module.css        # Scoped styles + animations
└── lib/
    ├── Stack.js            # Stack class + isBalanced() algorithm
    └── Queue.js            # Queue class (circular buffer) + hotPotato()
```

---

## Operations & Complexity

### Stack
| Operation | Time | Notes                          |
|-----------|------|--------------------------------|
| Push      | O(1) | Add to top                     |
| Pop       | O(1) | Remove from top                |
| Peek      | O(1) | Read top without removing      |
| Search    | O(n) | Linear scan (not typical use)  |
| Space     | O(n) | n elements stored              |

### Queue (Circular Buffer)
| Operation | Time       | Notes                             |
|-----------|------------|-----------------------------------|
| Enqueue   | O(1) amort | Add to back; doubles cap if full  |
| Dequeue   | O(1)       | Remove from front (no array shift)|
| Peek      | O(1)       | Read front without removing       |
| Search    | O(n)       | Linear scan                       |
| Space     | O(n)       | n elements + buffer overhead      |

> **Note:** Naive array-based Queue has O(n) dequeue due to `Array.shift()`. This implementation uses a **circular buffer** with head/tail pointers for true O(1) dequeue.

---

## Key Concepts Demonstrated

- **Private class fields** (`#items`, `#buf`) — modern JS encapsulation
- **Circular buffer** — avoids O(n) `shift()` in Queue
- **Stack algorithm** — `isBalanced()` for parentheses matching
- **Queue algorithm** — `hotPotato()` game simulation
- **React state immutability** — data structures re-created on each mutation
- **CSS Modules** — scoped keyframe animations (`popIn`, `flashAnim`)

---
