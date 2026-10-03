import { useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

type Props = {
  poster: string;
  reel?: string;
  alt: string;
};

export function LivePreview({ poster, reel, alt }: Props) {
  const reduced = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canPlay = Boolean(reel) && !reduced;

  const start = () => {
    if (!canPlay) return;
    void videoRef.current?.play();
  };

  const stop = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <div
      className="live-preview"
      onPointerEnter={start}
      onPointerLeave={stop}
      onFocus={start}
      onBlur={stop}
    >
      <img className="live-preview-media" src={poster} alt={alt} />
      {canPlay && (
        <>
          <video
            ref={videoRef}
            className="live-preview-media live-preview-reel"
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
            aria-hidden="true"
          >
            <source src={reel} type="video/webm" />
          </video>
          <div className="live-preview-veil" aria-hidden="true">
            <span className="live-preview-pause">
              <i />
              <i />
            </span>
          </div>
        </>
      )}
    </div>
  );
}
