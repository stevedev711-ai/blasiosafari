"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Optional muted loop over the still hero image. Only mounts on wider screens
 * for visitors without a reduced-motion preference; everyone else keeps the
 * still image, which is also the poster.
 */
export function HeroVideo({ src, webmSrc, poster }: { src: string; webmSrc?: string | null; poster: string }) {
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(true);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 900px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(wide.matches && !reduced.matches);
    update();
    wide.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  if (!enabled) return null;

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <div className="hero-media" aria-hidden="true">
        <video ref={ref} autoPlay muted loop playsInline preload="metadata" poster={poster}>
          {webmSrc && <source src={webmSrc} type="video/webm" />}
          <source src={src} type="video/mp4" />
        </video>
      </div>
      <button type="button" className="video-toggle" onClick={toggle} aria-pressed={!playing}>
        {playing ? "Pause video" : "Play video"}
      </button>
    </>
  );
}
