import { useRef, useState } from 'react';
import { useFineHover } from '../hooks/useFineHover';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

type Props = {
  poster: string;
  reel?: string;
  alt: string;
};

export function LivePreview({ poster, reel, alt }: Props) {
  const reduced = usePrefersReducedMotion();
  const fineHover = useFineHover();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const canPlay = Boolean(reel) && !reduced;

  const start = () => {
    if (!canPlay) return;
    void videoRef.current?.play();
    setPlaying(true);
  };

  const stop = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    setPlaying(false);
  };

  return (
    <div
      className={`live-preview${playing ? ' is-playing' : ''}`}
      onPointerEnter={fineHover ? start : undefined}
      onPointerLeave={fineHover ? stop : undefined}
      onFocus={fineHover ? start : undefined}
      onBlur={fineHover ? stop : undefined}
      onClick={() => {
        if (fineHover || !canPlay) return;
        if (playing) stop();
        else start();
      }}
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
          {fineHover && (
            <div className="live-preview-veil" aria-hidden="true">
              <span className="live-preview-pause">
                <i />
                <i />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
