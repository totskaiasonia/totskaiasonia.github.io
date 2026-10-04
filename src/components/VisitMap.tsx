import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export type MapSession = {
  id: string;
  city?: string;
  region?: string;
  country?: string;
  countryName?: string;
  lat: number | null;
  lon: number | null;
  leadIds: string[];
};

type Props = {
  sessions: MapSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

function jitter(id: string, lat: number, lon: number) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  const a = ((h % 17) - 8) * 0.035;
  const b = (((h >>> 8) % 17) - 8) * 0.035;
  return [lat + a, lon + b] as const;
}

export function VisitMap({ sessions, activeId, onSelect }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!rootRef.current || mapRef.current) return;
    const map = L.map(rootRef.current, {
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
    }).setView([22.5, 35], 2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 12,
    }).addTo(map);
    L.control.zoom({ position: 'topright' }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    window.setTimeout(() => map.invalidateSize(), 80);
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const points: L.LatLngExpression[] = [];
    for (const s of sessions) {
      if (s.lat == null || s.lon == null) continue;
      const [lat, lon] = jitter(s.id, s.lat, s.lon);
      points.push([lat, lon]);
      const isLead = s.leadIds.length > 0;
      const active = s.id === activeId;
      const marker = L.circleMarker([lat, lon], {
        radius: active ? 10 : 6,
        color: active ? '#f4e27a' : isLead ? '#ff3b1f' : '#2ec4b6',
        weight: active ? 2 : 1,
        fillColor: active ? '#f4e27a' : isLead ? '#ff3b1f' : '#2ec4b6',
        fillOpacity: active ? 0.95 : 0.72,
      });
      const place = [s.city, s.region, s.countryName || s.country].filter(Boolean).join(' · ') || 'Unknown';
      marker.bindTooltip(place, {
        direction: 'top',
        className: 'atlas-tip',
        opacity: 1,
      });
      marker.on('click', () => onSelect(s.id));
      marker.addTo(layer);
    }
    if (points.length === 1) map.setView(points[0], 5);
    else if (points.length > 1) map.fitBounds(L.latLngBounds(points).pad(0.35), { maxZoom: 5 });
  }, [sessions, activeId, onSelect]);

  const geoCount = sessions.filter((s) => s.lat != null && s.lon != null).length;

  return (
    <figure className="admin-map-frame">
      <div className="admin-map-chrome">
        <span />
        <span />
        <span />
        <em>Visitor plate · {geoCount} geocoded</em>
      </div>
      <div ref={rootRef} className="admin-map" />
      {geoCount === 0 ? (
        <p className="admin-map-empty">No geocoded visits yet — allow analytics on the public site first.</p>
      ) : null}
    </figure>
  );
}
