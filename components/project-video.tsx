"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useRef, useState } from "react";

const posters: Record<string, string> = {
  "/videos/tradeflow-sa-demo-15s.mp4": "/tradeflow.webp",
  "/videos/churchflow-demo-15s.mp4": "/img1.webp",
  "/videos/JavaPOS-15-second-demo.mp4": "/img3.webp",
  "/videos/clinical-reasoning-demo-15s.mp4": "/images/clinical-reasoning-still.webp",
};

// Screenshots lead; the existing demos remain available through deliberate playback.
// Both formats share one frame, ready for a future visibility-driven video treatment.
export default function ProjectVideo({
  src,
  name,
  priority = false,
}: {
  src: string;
  name: string;
  priority?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const label = `${name} — 15-second demo`;

  async function play() {
    const element = video.current;
    if (!element) return;
    setPlaying(true);
    try {
      await element.play();
      element.focus();
    } catch {
      setPlaying(false);
    }
  }

  return (
    <div className="project-media" data-playing={playing || undefined}>
      <video
        ref={video}
        className="project-video"
        controls={playing}
        inert={!playing}
        playsInline
        preload="none"
        poster={posters[src]}
        aria-label={label}
        aria-hidden={!playing}
        tabIndex={playing ? 0 : -1}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support embedded video. <a href={src}>Download the {name} demo</a>.
      </video>
      {!playing && (
        <button className="project-poster" onClick={play} aria-label={label}>
          <Image
            src={posters[src]}
            alt={name}
            fill
            sizes={priority ? "(max-width: 760px) 90vw, 46vw" : "(max-width: 760px) 90vw, 80vw"}
            priority={priority}
          />
          <span className="media-play" aria-hidden="true"><Play size={20} /></span>
        </button>
      )}
    </div>
  );
}
