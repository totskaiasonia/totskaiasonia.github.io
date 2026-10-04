const SESSION_KEY = 'st-session';

export function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function readUtm() {
  const params = new URLSearchParams(window.location.search);
  const fresh = {
    source: params.get('utm_source') || '',
    medium: params.get('utm_medium') || '',
    campaign: params.get('utm_campaign') || '',
  };
  if (fresh.source || fresh.medium || fresh.campaign) {
    sessionStorage.setItem('st-utm', JSON.stringify(fresh));
    return fresh;
  }
  try {
    return JSON.parse(sessionStorage.getItem('st-utm') || '{}') as typeof fresh;
  } catch {
    return { source: '', medium: '', campaign: '' };
  }
}
