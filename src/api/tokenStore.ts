export interface TokenStore {
  access: string | null;
  refresh: string | null;
}

const STORAGE_KEY = 'uninote.auth';

function load(): TokenStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return { access: null, refresh: null };
}

let store = load();

function hydrate() {
  store = load();
}

export const tokenStore = {
  get access() { return store.access; },
  get refresh() { return store.refresh; },
  setAccess(access: string) { store.access = access; this.persist(); },
  setRefresh(refresh: string) { store.refresh = refresh; this.persist(); },
  set(tokens: { access: string; refresh: string }) { store = { access: tokens.access, refresh: tokens.refresh }; this.persist(); },
  clear() { store = { access: null, refresh: null }; localStorage.removeItem(STORAGE_KEY); },
  persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); },
  hydrate,
};