"use client";

import { useState, useRef, useCallback } from "react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export default function VideoPlayer({ src, poster, className = "" }: VideoPlayerProps) {
  const [started, setStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = useCallback(() => {
    setStarted(true);
    // Small delay to let the src load, then play
    setTimeout(() => {
      videoRef.current?.play();
    }, 50);
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-black ${className}`}
    >
      {!started ? (
        /* Play overlay - don't load video src until clicked */
        <button
          onClick={handlePlay}
          className="relative w-full aspect-video group cursor-pointer"
          aria-label="Play video"
        >
          {poster ? (
            <img
              src={poster}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--psp-navy)] to-[var(--psp-navy-mid)]" />
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="
                w-16 h-16 rounded-full flex items-center justify-center
                bg-[var(--psp-gold)] shadow-lg shadow-[var(--psp-gold)]/25
                group-hover:scale-110 transition-transform duration-200
              "
            >
              <svg
                className="w-7 h-7 ml-1"
                viewBox="0 0 24 24"
                fill="var(--psp-navy)"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          className="w-full aspect-video"
          playsInline
        />
      )}
    </div>
  );
}
