"use client";

import { useState, useCallback } from "react";
import { Stack, isBalanced } from "../lib/Stack";
import { Queue, hotPotato } from "../lib/Queue";
import styles from "./Simulator.module.css";

const USE_CASES = {
  stack: ["Function call stack", "Undo / redo (editors)", "Browser back button", "Balanced parentheses", "DFS traversal", "Expression evaluation"],
  queue: ["CPU task scheduling", "Print spooler", "BFS traversal", "Message queues (Kafka)", "Ticket systems", "Streaming buffers"],
};

const TABS = [
  { id: "stack", label: "Stack (LIFO)" },
  { id: "queue", label: "Queue (FIFO)" },
  { id: "both",  label: "Side by side" },
];

function makeStack() { return new Stack(); }
function makeQueue() { return new Queue(); }

export default function Simulator() {
  const [tab, setTab]         = useState("stack");
  const [stack, setStack]     = useState(() => makeStack());
  const [stackArr, setStackArr] = useState([]);
  const [queue, setQueue]     = useState(() => makeQueue());
  const [queueArr, setQueueArr] = useState([]);

  const [stackInput, setStackInput] = useState("");
  const [queueInput, setQueueInput] = useState("");
  const [parenInput, setParenInput] = useState("");
  const [parenResult, setParenResult] = useState(null);

  const [log, setLog]         = useState([]);
  const [ops, setOps]         = useState(0);
  const [flashIdx, setFlashIdx] = useState(null); // index in stack/queue to highlight

  const addLog = useCallback((cls, op, msg) => {
    setLog(prev => [{ id: Date.now() + Math.random(), cls, op, msg }, ...prev].slice(0, 50));
    setOps(o => o + 1);
  }, []);

  // ── Stack ops ─────────────────────────────────────────────────────────────
  function doPush() {
    const v = parseInt(stackInput);
    if (isNaN(v)) return;
    const s = makeStack(); stackArr.forEach(x => s.push(x)); s.push(v);
    setStackArr(s.toArray()); setStack(s); setStackInput("");
    setFlashIdx({ ds: "stack", i: s.size - 1 });
    addLog("purple", "PUSH", `Pushed ${v} → top of stack`);
  }

  function doPop() {
    if (stack.isEmpty) return addLog("coral", "POP", "Stack underflow — empty!");
    const s = makeStack(); stackArr.forEach(x => s.push(x));
    const v = s.pop();
    setStackArr(s.toArray()); setStack(s);
    addLog("coral", "POP", `Popped ${v} from top`);
  }

  function doPeek() {
    if (stack.isEmpty) return addLog("coral", "PEEK", "Stack is empty");
    addLog("teal", "PEEK", `Top element is ${stackArr[stackArr.length - 1]}`);
    setFlashIdx({ ds: "stack", i: stackArr.length - 1 });
  }

  function doLoadStack(arr) {
    const s = makeStack(); arr.forEach(x => s.push(x));
    setStackArr(s.toArray()); setStack(s);
    addLog("teal", "LOAD", `Loaded [${arr.join(", ")}]`);
  }

  function doClearStack() {
    setStackArr([]); setStack(makeStack());
    addLog("teal", "CLEAR", "Stack cleared");
  }

  // ── Queue ops ─────────────────────────────────────────────────────────────
  function doEnqueue() {
    const v = parseInt(queueInput);
    if (isNaN(v)) return;
    const q = makeQueue(); queueArr.forEach(x => q.enqueue(x)); q.enqueue(v);
    setQueueArr(q.toArray()); setQueue(q); setQueueInput("");
    setFlashIdx({ ds: "queue", i: q.size - 1 });
    addLog("teal", "ENQ", `Enqueued ${v} → back of queue`);
  }

  function doDequeue() {
    if (queue.isEmpty) return addLog("coral", "DEQ", "Queue underflow — empty!");
    const q = makeQueue(); queueArr.forEach(x => q.enqueue(x));
    const v = q.dequeue();
    setQueueArr(q.toArray()); setQueue(q);
    addLog("coral", "DEQ", `Dequeued ${v} from front`);
  }

  function doPeekQueue() {
    if (queue.isEmpty) return addLog("coral", "PEEK", "Queue is empty");
    addLog("teal", "PEEK", `Front element is ${queueArr[0]}`);
    setFlashIdx({ ds: "queue", i: 0 });
  }

  function doLoadQueue(arr) {
    const q = makeQueue(); arr.forEach(x => q.enqueue(x));
    setQueueArr(q.toArray()); setQueue(q);
    addLog("teal", "LOAD", `Loaded [${arr.join(", ")}]`);
  }

  function doClearQueue() {
    setQueueArr([]); setQueue(makeQueue());
    addLog("teal", "CLEAR", "Queue cleared");
  }

  // ── Bonus: balanced parens ────────────────────────────────────────────────
  function doCheckParens() {
    if (!parenInput.trim()) return;
    const result = isBalanced(parenInput);
    setParenResult(result);
    addLog(result.balanced ? "teal" : "coral", "PAREN",
      result.balanced ? `"${parenInput}" is balanced` : `"${parenInput}" is NOT balanced`);
  }

  const showStack = tab === "stack" || tab === "both";
  const showQueue = tab === "queue" || tab === "both";
  const activeDS  = tab === "queue" ? "queue" : "stack";
  const sz        = tab === "both" ? `${stackArr.length} / ${queueArr.length}` : (activeDS === "stack" ? stackArr.length : queueArr.length);
  const peek      = tab === "both"
    ? `${stackArr.length ? stackArr[stackArr.length - 1] : "—"} / ${queueArr.length ? queueArr[0] : "—"}`
    : activeDS === "stack"
      ? (stackArr.length ? stackArr[stackArr.length - 1] : "—")
      : (queueArr.length ? queueArr[0] : "—");

  const useCaseList = tab === "both"
    ? [...USE_CASES.stack.map(u => ({ u, ds: "stack" })), ...USE_CASES.queue.map(u => ({ u, ds: "queue" }))]
    : USE_CASES[activeDS].map(u => ({ u, ds: activeDS }));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Stack &amp; Queue Simulator</h1>
        {/* <span className={styles.badge}>Day 03 · Data Structures</span> */}
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map(t => (
          <button key={t.id} className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Workspace */}
      <div className={styles.workspace} style={{ gridTemplateColumns: tab === "both" ? "1fr 1fr" : "1fr" }}>
        {showStack && (
          <section className={styles.panel}>
            <h3 className={styles.panelTitle}>Stack — LIFO</h3>
            <div className={styles.row}>
              <input className={styles.inp} type="number" placeholder="Value" value={stackInput}
                onChange={e => setStackInput(e.target.value)} onKeyDown={e => e.key === "Enter" && doPush()} />
              <button className={`${styles.btn} ${styles.btnPurple}`} onClick={doPush}>Push</button>
              <button className={`${styles.btn} ${styles.btnCoral}`} onClick={doPop}>Pop</button>
              <button className={styles.btn} onClick={doPeek}>Peek</button>
            </div>
            <div className={styles.row}>
              <button className={styles.btn} onClick={() => doLoadStack([5, 10, 15, 20])}>Sample</button>
              <button className={styles.btn} onClick={doClearStack}>Clear</button>
            </div>

            {/* Stack viz — vertical, bottom to top */}
            <div className={styles.stackViz}>
              {stackArr.length === 0 ? (
                <span className={styles.emptyHint}>Stack is empty</span>
              ) : (
                <div className={styles.stackCol}>
                  {[...stackArr].reverse().map((v, ri) => {
                    const i = stackArr.length - 1 - ri;
                    const isTop = i === stackArr.length - 1;
                    return (
                      <div key={`${i}-${v}`} className={`${styles.stackCell} ${isTop ? styles.stackTop : ""} ${flashIdx?.ds === "stack" && flashIdx?.i === i ? styles.flash : ""}`}>
                        <span className={styles.cellVal}>{v}</span>
                        {isTop && <span className={styles.cellBadge}>TOP</span>}
                      </div>
                    );
                  })}
                  <div className={styles.stackBase}>▲ bottom</div>
                </div>
              )}
            </div>
          </section>
        )}

        {showQueue && (
          <section className={styles.panel}>
            <h3 className={styles.panelTitle}>Queue — FIFO</h3>
            <div className={styles.row}>
              <input className={styles.inp} type="number" placeholder="Value" value={queueInput}
                onChange={e => setQueueInput(e.target.value)} onKeyDown={e => e.key === "Enter" && doEnqueue()} />
              <button className={`${styles.btn} ${styles.btnTeal}`} onClick={doEnqueue}>Enqueue</button>
              <button className={`${styles.btn} ${styles.btnCoral}`} onClick={doDequeue}>Dequeue</button>
              <button className={styles.btn} onClick={doPeekQueue}>Peek</button>
            </div>
            <div className={styles.row}>
              <button className={styles.btn} onClick={() => doLoadQueue([1, 2, 3, 4, 5])}>Sample</button>
              <button className={styles.btn} onClick={doClearQueue}>Clear</button>
            </div>

            {/* Queue viz — horizontal, front to back */}
            <div className={styles.queueViz}>
              {queueArr.length === 0 ? (
                <span className={styles.emptyHint}>Queue is empty</span>
              ) : (
                <div className={styles.queueRow}>
                  {queueArr.map((v, i) => {
                    const isFront = i === 0, isBack = i === queueArr.length - 1;
                    return (
                      <div key={`${i}-${v}`} className={styles.queueGroup}>
                        <div className={`${styles.queueCell} ${isFront ? styles.queueFront : isBack ? styles.queueBack : ""} ${flashIdx?.ds === "queue" && flashIdx?.i === i ? styles.flash : ""}`}>
                          <span className={styles.cellVal}>{v}</span>
                          {isFront && <span className={styles.cellBadge} style={{ color: "#0F6E56" }}>FRONT</span>}
                          {isBack && !isFront && <span className={styles.cellBadge} style={{ color: "#993C1D" }}>BACK</span>}
                        </div>
                        {i < queueArr.length - 1 && <span className={styles.queueArrow}>→</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        {[
          [tab === "both" ? "S/Q size" : `${tab === "stack" ? "Stack" : "Queue"} size`, sz],
          [tab === "queue" ? "Front / peek" : "Top / peek", peek],
          ["Total ops", ops],
        ].map(([lbl, val]) => (
          <div key={lbl} className={styles.stat}>
            <div className={styles.statLbl}>{lbl}</div>
            <div className={styles.statVal}>{val}</div>
          </div>
        ))}
      </div>

      {/* Complexity chips */}
      <div className={styles.chips}>
        {(tab === "queue"
          ? [["Enqueue", "O(1)"], ["Dequeue", "O(1)"], ["Peek", "O(1)"], ["Search", "O(n)"], ["Space", "O(n)"]]
          : [["Push", "O(1)"], ["Pop", "O(1)"], ["Peek", "O(1)"], ["Search", "O(n)"], ["Space", "O(n)"]]
        ).map(([op, cx]) => (
          <div key={op} className={styles.chip}>{op}: <strong>{cx}</strong></div>
        ))}
      </div>

      {/* Use cases */}
      <div className={styles.useCaseBox}>
        <div className={styles.ucTitle}>
          {tab === "both" ? "Real-world applications" : `${tab === "stack" ? "Stack" : "Queue"} — real-world uses`}
        </div>
        <div className={styles.ucList}>
          {useCaseList.map(({ u, ds }) => (
            <span key={u} className={`${styles.ucTag} ${ds === "stack" ? styles.ucStack : styles.ucQueue}`}>{u}</span>
          ))}
        </div>
      </div>

      {/* Bonus: Balanced parentheses */}
      {/* {(tab === "stack" || tab === "both") && (
        <div className={styles.bonusBox}>
          <div className={styles.bonusTitle}>Bonus — Balanced parentheses checker</div>
          <div className={styles.row}>
            <input className={styles.inp} type="text" placeholder='e.g.  {[()]}  or  ([)]'
              value={parenInput} onChange={e => setParenInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && doCheckParens()} />
            <button className={`${styles.btn} ${styles.btnPurple}`} onClick={doCheckParens}>Check</button>
          </div>
          {parenResult && (
            <div className={`${styles.parenResult} ${parenResult.balanced ? styles.parenOk : styles.parenErr}`}>
              {parenResult.balanced ? "Balanced" : "Not balanced"} — {parenResult.steps.length} stack operations
            </div>
          )}
        </div>
      )} */}

      {/* Log */}
      {/* <div className={styles.logBox}>
        <div className={styles.logHdr}>Operation log</div>
        <div className={styles.logList}>
          {log.length === 0
            ? <div className={styles.logEmpty}>No operations yet.</div>
            : log.map(e => (
              <div key={e.id} className={styles.logItem}>
                <span className={`${styles.logOp} ${styles[`logOp_${e.cls}`]}`}>[{e.op}]</span>
                <span className={styles.logMsg}>{e.msg}</span>
              </div>
            ))}
        </div>
      </div> */}
    </div>
  );
}
