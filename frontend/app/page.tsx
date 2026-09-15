"use client";

import { FormEvent, useRef, useState } from "react";
import styles from "./page.module.css";

type Message = { role: "user" | "assistant"; content: string };
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();
    if (!content || loading) return;
    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail ?? "جواب حاصل نه ٿي سگهيو.");
      setMessages([...nextMessages, data.message]);
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "رابطي ۾ مسئلو ٿيو.");
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
    setError("");
  }

  return (
    <main className={styles.shell}>
      <section className={styles.card} aria-label="سنڌي AI چيٽ">
        <header className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.logo} aria-hidden="true">سن</div>
            <div>
              <p className={styles.eyebrow}>ذهين گفتگو</p>
              <h1>سنڌي AI اسسٽنٽ</h1>
            </div>
          </div>
          <button className={styles.clear} onClick={clearChat} disabled={!messages.length} type="button">
            نئين گفتگو
          </button>
        </header>

        <div className={styles.messages} aria-live="polite">
          {!messages.length && !loading && (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>✦</span>
              <h2>اڄ ڇا سکڻ چاهيو ٿا؟</h2>
              <p>سنڌي ۾ سوال پڇو، خيال ونڊيو يا ڪنهن ڪم ۾ مدد وٺو.</p>
              <div className={styles.suggestions}>
                {["سنڌي شاعري بابت ٻڌايو", "اڄ جو سٺو خيال ڏيو", "مون لاءِ ڪهاڻي لکو"].map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => setInput(suggestion)}>
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div className={`${styles.message} ${message.role === "user" ? styles.user : styles.assistant}`} key={`${message.role}-${index}`}>
              <span className={styles.messageLabel}>{message.role === "user" ? "توهان" : "AI اسسٽنٽ"}</span>
              <p>{message.content}</p>
            </div>
          ))}
          {loading && (
            <div className={`${styles.message} ${styles.assistant}`} aria-label="جواب تيار ٿي رهيو آهي">
              <span className={styles.messageLabel}>AI اسسٽنٽ</span>
              <div className={styles.dots}><i /><i /><i /></div>
            </div>
          )}
          {error && <div className={styles.error} role="alert">{error}</div>}
          <div ref={endRef} />
        </div>

        <form className={styles.composer} onSubmit={submit}>
          <label htmlFor="message" className={styles.srOnly}>پنهنجو پيغام لکو</label>
          <textarea
            id="message"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="پنهنجو سوال هتي لکو..."
            rows={1}
            disabled={loading}
          />
          <button className={styles.send} type="submit" disabled={!input.trim() || loading} aria-label="موڪليو">↑</button>
          <small>Enter موڪلڻ لاءِ · Shift + Enter نئين سٽ لاءِ</small>
        </form>
      </section>
      <footer>سنڌي ٻولي سان، سنڌي ماڻهن لاءِ <span>•</span> توهان جي گفتگو محفوظ نٿي ڪئي وڃي</footer>
    </main>
  );
}

