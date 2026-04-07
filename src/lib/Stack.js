/**
 * Stack — Last In, First Out (LIFO)
 * All core operations are O(1) using a JS array as the underlying storage.
 */
export class Stack {
  #items = [];

  /** O(1) — Push element onto top of stack */
  push(val) {
    this.#items.push(val);
    return this.size;
  }

  /** O(1) — Remove and return top element */
  pop() {
    if (this.isEmpty) throw new Error("Stack underflow");
    return this.#items.pop();
  }

  /** O(1) — Return top element without removing */
  peek() {
    if (this.isEmpty) throw new Error("Stack is empty");
    return this.#items[this.#items.length - 1];
  }

  /** O(n) — Check if value exists */
  contains(val) { return this.#items.includes(val); }

  /** O(1) — Clear entire stack */
  clear() { this.#items = []; }

  get size()    { return this.#items.length; }
  get isEmpty() { return this.#items.length === 0; }
  get top()     { return this.isEmpty ? null : this.#items[this.#items.length - 1]; }

  /** Returns array bottom→top for rendering */
  toArray() { return [...this.#items]; }
}

/**
 * Application: Balanced Parentheses Checker
 * Classic Stack algorithm — O(n) time, O(n) space
 */
export function isBalanced(str) {
  const stack = new Stack();
  const map = { ')': '(', ']': '[', '}': '{' };
  const steps = [];

  for (const ch of str) {
    if ('([{'.includes(ch)) {
      stack.push(ch);
      steps.push({ char: ch, action: 'push', stackSnap: stack.toArray() });
    } else if (')]}'.includes(ch)) {
      if (stack.isEmpty || stack.peek() !== map[ch]) {
        steps.push({ char: ch, action: 'mismatch', stackSnap: stack.toArray() });
        return { balanced: false, steps };
      }
      stack.pop();
      steps.push({ char: ch, action: 'pop', stackSnap: stack.toArray() });
    }
  }
  return { balanced: stack.isEmpty, steps };
}
