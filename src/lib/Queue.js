/**
 * Queue — First In, First Out (FIFO)
 *
 * Implemented with a circular buffer for O(1) enqueue AND dequeue.
 * A naive array-based queue has O(n) dequeue due to array shift.
 */
export class Queue {
  #buf;
  #head = 0;
  #tail = 0;
  #size = 0;
  #cap;

  constructor(initialCapacity = 16) {
    this.#cap = initialCapacity;
    this.#buf = new Array(initialCapacity).fill(null);
  }

  /** O(1) amortised — Add element to back */
  enqueue(val) {
    if (this.#size === this.#cap) this.#grow();
    this.#buf[this.#tail] = val;
    this.#tail = (this.#tail + 1) % this.#cap;
    this.#size++;
    return this.#size;
  }

  /** O(1) — Remove and return front element */
  dequeue() {
    if (this.isEmpty) throw new Error("Queue underflow");
    const val = this.#buf[this.#head];
    this.#buf[this.#head] = null;
    this.#head = (this.#head + 1) % this.#cap;
    this.#size--;
    return val;
  }

  /** O(1) — Return front element without removing */
  peek() {
    if (this.isEmpty) throw new Error("Queue is empty");
    return this.#buf[this.#head];
  }

  /** O(1) — Return back element without removing */
  peekBack() {
    if (this.isEmpty) throw new Error("Queue is empty");
    const backIdx = (this.#tail - 1 + this.#cap) % this.#cap;
    return this.#buf[backIdx];
  }

  clear() { this.#buf = new Array(this.#cap).fill(null); this.#head = 0; this.#tail = 0; this.#size = 0; }

  get size()     { return this.#size; }
  get isEmpty()  { return this.#size === 0; }
  get front()    { return this.isEmpty ? null : this.#buf[this.#head]; }
  get capacity() { return this.#cap; }

  /** Returns array front→back for rendering */
  toArray() {
    const result = [];
    for (let i = 0; i < this.#size; i++) {
      result.push(this.#buf[(this.#head + i) % this.#cap]);
    }
    return result;
  }

  #grow() {
    const newCap = this.#cap * 2;
    const newBuf = new Array(newCap).fill(null);
    for (let i = 0; i < this.#size; i++) {
      newBuf[i] = this.#buf[(this.#head + i) % this.#cap];
    }
    this.#buf = newBuf;
    this.#head = 0;
    this.#tail = this.#size;
    this.#cap = newCap;
  }
}

/**
 * Application: Hot Potato simulation
 * Classic Queue algorithm
 */
export function hotPotato(names, passes) {
  const q = new Queue();
  names.forEach(n => q.enqueue(n));
  const rounds = [];

  while (q.size > 1) {
    for (let i = 0; i < passes; i++) q.enqueue(q.dequeue());
    const eliminated = q.dequeue();
    rounds.push({ eliminated, remaining: q.toArray() });
  }

  return { winner: q.dequeue(), rounds };
}
