import { useEffect, useState } from 'react';
import { useFineHover } from '../hooks/useFineHover';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export function Crosshair() {
  const reduced = usePrefersReducedMotion();
  const fineHover = useFineHover();
  const enabled = fineHover && !reduced;
  const [pos, setPos] = useState({ x: -40, y: -40 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled]);

  if (!enabled) return null;

  return <div className="crosshair" style={{ left: pos.x, top: pos.y }} aria-hidden="true" />;
}
