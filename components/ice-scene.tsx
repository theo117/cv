"use client";

import { useEffect, useRef, useState } from "react";

// Inline the tiny frame document so host-specific .html routing cannot hide the
// live scene behind its poster. Module/asset URLs still load from this site.
const sceneDocument = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Portfolio landscape</title><link rel="icon" href="data:,"><style>html,body,#scene{margin:0;width:100%;height:100%;overflow:hidden;background:#a0a5b1}canvas{display:block}body{pointer-events:none}</style></head>
<body><div id="scene"></div><script type="module" src="/igloo/scene.js"></script></body></html>`;

/** Isolate the supplied production renderer; React owns content and page navigation. */
export default function IceScene() {
  const frame = useRef<HTMLIFrameElement>(null);
  const pauseRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    pauseRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const element = frame.current;
    const sequence = element?.closest<HTMLElement>(".hero-sequence");
    if (!element || !sequence) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const origin = window.location.origin;
    let animation = 0;
    let visible = true;
    let ready = false;
    let progress = 0;
    let previous = 0;
    let lastSent = "";

    const sendState = (force = false) => {
      const state = {
        source: "cv-portfolio",
        type: "state",
        progress: reduced.matches ? 0 : Number(progress.toFixed(4)),
        active: visible && !document.hidden,
        paused: pauseRef.current,
        reduced: reduced.matches,
      };
      const key = JSON.stringify(state);
      if (ready && (force || key !== lastSent)) {
        element.contentWindow?.postMessage(state, origin);
        lastSent = key;
      }
    };

    const reset = () => {
      delete sequence.dataset.animated;
      sequence.dataset.scene = "landscape";
      sequence.style.removeProperty("--scene-progress");
    };

    const message = (event: MessageEvent) => {
      if (event.origin !== origin || event.source !== element.contentWindow || event.data?.source !== "cv-igloo") return;
      if (event.data.type === "ready") {
        ready = true;
        // Do not shift the CV if a slow GPU finishes loading after the user left.
        if (sequence.getBoundingClientRect().top >= -12) sequence.dataset.animated = "true";
        setStatus("ready");
        sendState(true);
      } else if (event.data.type === "error") {
        ready = false;
        reset();
        setStatus("error");
      }
    };

    const render = (now: number) => {
      animation = requestAnimationFrame(render);
      const delta = Math.min((now - previous) / 1000, .08);
      previous = now;
      if (ready && visible && !document.hidden) {
        const bounds = sequence.getBoundingClientRect();
        if (!sequence.dataset.animated && bounds.top >= -12) sequence.dataset.animated = "true";
        if (!pauseRef.current && !reduced.matches && sequence.dataset.animated) {
          const target = Math.max(0, Math.min(-bounds.top / Math.max(1, bounds.height - element.clientHeight), 1));
          progress += (target - progress) * (1 - Math.exp(-delta * 9));
        }
        const current = reduced.matches ? 0 : progress;
        sequence.style.setProperty("--scene-progress", current.toFixed(4));
        sequence.dataset.scene = current < .3 ? "landscape" : current > .77 ? "ice" : "transition";
      }
      sendState();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sendState(true);
    }, { rootMargin: "80px" });
    const changed = () => sendState(true);
    const pointer = (event: PointerEvent) => {
      if (!ready || !visible || pauseRef.current || reduced.matches || event.pointerType === "touch") return;
      const bounds = element.getBoundingClientRect();
      element.contentWindow?.postMessage({
        source: "cv-portfolio", type: "pointer",
        x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)),
        y: Math.max(0, Math.min(1, 1 - (event.clientY - bounds.top) / bounds.height)),
      }, origin);
    };
    observer.observe(element);
    window.addEventListener("message", message);
    window.addEventListener("pointermove", pointer, { passive: true });
    document.addEventListener("visibilitychange", changed);
    reduced.addEventListener("change", changed);
    // Recover readiness/error messages if the iframe loaded before hydration.
    element.contentWindow?.postMessage({ source: "cv-portfolio", type: "hello" }, origin);
    animation = requestAnimationFrame(render);

    return () => {
      ready = false;
      element.contentWindow?.postMessage({ source: "cv-portfolio", type: "state", active: false }, origin);
      cancelAnimationFrame(animation);
      observer.disconnect();
      window.removeEventListener("message", message);
      window.removeEventListener("pointermove", pointer);
      document.removeEventListener("visibilitychange", changed);
      reduced.removeEventListener("change", changed);
      reset();
    };
  }, []);

  return (
    <div className="ice-scene" data-status={status}>
      <div className="ice-fallback" aria-hidden="true" />
      <iframe
        ref={frame}
        className="igloo-renderer"
        srcDoc={sceneDocument}
        title="Decorative frozen landscape and ice sculpture"
        aria-hidden="true"
        tabIndex={-1}
        sandbox="allow-scripts allow-same-origin"
        onError={() => setStatus("error")}
      />
      {status === "ready" && (
        <button
          className="motion-toggle"
          onClick={() => setPaused(value => !value)}
          aria-pressed={paused}
          aria-label={paused ? "Resume scene animation" : "Pause scene animation"}
        >
          <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
          {paused ? "Resume motion" : "Pause motion"}
        </button>
      )}
    </div>
  );
}
