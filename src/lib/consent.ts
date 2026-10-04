export const CONSENT_KEY = 'st-consent';

export type Consent = 'unset' | 'needed' | 'all';

export function readConsent(): Consent {
  const v = localStorage.getItem(CONSENT_KEY);
  if (v === 'needed' || v === 'all') return v;
  return 'unset';
}

export function writeConsent(value: Exclude<Consent, 'unset'>) {
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new Event('st-consent'));
}
