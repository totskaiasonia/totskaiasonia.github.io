export type ClientGeo = {
  city: string;
  region: string;
  countryName: string;
  country: string;
  lat: number;
  lon: number;
};

let cached: ClientGeo | null | undefined;

export async function lookupClientGeo(): Promise<ClientGeo | null> {
  if (cached !== undefined) return cached;
  const ctrl = new AbortController();
  const t = window.setTimeout(() => ctrl.abort(), 2200);
  try {
    const res = await fetch('https://ipwho.is/', { signal: ctrl.signal });
    const data = (await res.json()) as {
      success?: boolean;
      city?: string;
      region?: string;
      country?: string;
      country_code?: string;
      latitude?: number;
      longitude?: number;
    };
    const lat = Number(data.latitude);
    const lon = Number(data.longitude);
    if (!data?.success || !Number.isFinite(lat) || !Number.isFinite(lon)) {
      cached = null;
      return null;
    }
    cached = {
      city: String(data.city || '').slice(0, 56),
      region: String(data.region || '').slice(0, 56),
      countryName: String(data.country || '').slice(0, 56),
      country: String(data.country_code || '').slice(0, 8),
      lat,
      lon,
    };
    return cached;
  } catch {
    cached = null;
    return null;
  } finally {
    window.clearTimeout(t);
  }
}
