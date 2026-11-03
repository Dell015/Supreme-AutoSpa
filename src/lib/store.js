// Lead store for the owner admin.
// Two modes, chosen at build time:
//   - Supabase: when PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are set.
//   - Demo: leads live in this browser's localStorage, seeded with labelled samples.
const URL_ = import.meta.env.PUBLIC_SUPABASE_URL || '';
const KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';
export const live = Boolean(URL_ && KEY);
export const STATUSES = ['new', 'replied', 'scheduled', 'done', 'closed'];

const LS = 'sas-demo-leads-v1';
const SS = 'sas-admin-session';
const safe = (fn, fb) => { try { return fn(); } catch { return fb; } };
const now = () => new Date().toISOString();
const ago = (h) => new Date(Date.now() - h * 3600e3).toISOString();

const seed = () => [
  { id: 's1', created_at: ago(1.2), status: 'new', name: 'Sample: Mark R.', phone: '0917 000 0001', email: '', contact: 'Messenger', vtype: 'MPV or van', vehicle: '2018 Toyota Innova 2.8 E', color: 'Silver', paint: 'Dull or faded', interior: 'Stains or bad odor', services: ['Interior detailing', 'Exterior detailing'], details: { Schedule: 'Sat, morning' }, notes: 'Needs it before the holidays.', photos: true, owner_notes: '', estimate: '', history: [{ at: ago(1.2), status: 'new' }], demo: true },
  { id: 's2', created_at: ago(5), status: 'new', name: 'Sample: Liza T.', phone: '0917 000 0002', email: 'sample@example.com', contact: 'Phone call', vtype: 'Sedan', vehicle: '2015 Honda Civic', color: 'White', paint: 'Scratches or swirl marks', interior: 'Lightly used', services: ['Car repainting', 'Ceramic coating'], details: { Repaint: 'Full body, same color', Coating: 'No existing coating' }, notes: 'Front bumper scratched from a parking incident.', photos: true, owner_notes: '', estimate: '', history: [{ at: ago(5), status: 'new' }], demo: true },
  { id: 's3', created_at: ago(30), status: 'replied', name: 'Sample: Jun D.', phone: '0917 000 0003', email: '', contact: 'Messenger', vtype: 'Pickup', vehicle: '2020 Toyota Hilux', color: 'Black', paint: 'Good, just needs a clean', interior: 'Dirty or dusty', services: ['Carwash', 'Undercarriage rinsing', 'Engine wash'], details: {}, notes: '', photos: false, owner_notes: 'Quoted by message. Waiting for him to confirm a day.', estimate: 'Rough range sent', history: [{ at: ago(30), status: 'new' }, { at: ago(28), status: 'replied' }], demo: true },
  { id: 's4', created_at: ago(78), status: 'replied', name: 'Sample: Ana C.', phone: '0917 000 0004', email: '', contact: 'Text message', vtype: 'Hatchback', vehicle: '2019 Suzuki Celerio', color: 'Red', paint: 'Dull or faded', interior: 'Heavily soiled', services: ['Interior detailing', 'Headlight restoration'], details: {}, notes: '', photos: true, owner_notes: '', estimate: '', history: [{ at: ago(78), status: 'new' }, { at: ago(76), status: 'replied' }], demo: true },
  { id: 's5', created_at: ago(52), status: 'scheduled', name: 'Sample: Ben S.', phone: '0917 000 0005', email: '', contact: 'Messenger', vtype: 'SUV', vehicle: '2017 Fortuner', color: 'White', paint: 'Good, just needs a clean', interior: 'Lightly used', services: ['PMS', 'Engine wash'], details: { Maintenance: '85000 km, last PMS 6 months ago' }, notes: '', photos: false, owner_notes: 'Coming in tomorrow 9 AM for the physical check.', estimate: '', history: [{ at: ago(52), status: 'new' }, { at: ago(50), status: 'replied' }, { at: ago(24), status: 'scheduled' }], demo: true },
  { id: 's6', created_at: ago(120), status: 'done', name: 'Sample: Carl M.', phone: '0917 000 0006', email: '', contact: 'Messenger', vtype: 'Motorcycle or scooter', vehicle: '2022 Honda ADV', color: 'Black', paint: '', interior: '', services: ['Carwash'], details: {}, notes: '', photos: false, owner_notes: 'Paid. Asked for a review.', estimate: '', history: [{ at: ago(120), status: 'new' }, { at: ago(118), status: 'replied' }, { at: ago(96), status: 'done' }], demo: true },
];

const demoRead = () => safe(() => { const v = JSON.parse(localStorage.getItem(LS)); return Array.isArray(v) ? v : null; }, null);
const demoWrite = (a) => safe(() => localStorage.setItem(LS, JSON.stringify(a)));
const demoAll = () => { let a = demoRead(); if (!a) { a = seed(); demoWrite(a); } return a; };

const sb = async (path, opts = {}, token) => {
  const r = await fetch(`${URL_}${path}`, { ...opts, headers: { apikey: KEY, Authorization: `Bearer ${token || KEY}`, 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  if (!r.ok) throw new Error((await r.text()) || r.statusText);
  return r.status === 204 ? null : r.json().catch(() => null);
};
const token = () => safe(() => JSON.parse(sessionStorage.getItem(SS))?.access_token, null);

export const auth = {
  signedIn: () => (live ? Boolean(token()) : safe(() => sessionStorage.getItem(SS) === 'demo', false)),
  async signIn(email, password) {
    if (!live) { safe(() => sessionStorage.setItem(SS, 'demo')); return; }
    const j = await sb('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) });
    safe(() => sessionStorage.setItem(SS, JSON.stringify(j)));
  },
  signOut() { safe(() => sessionStorage.removeItem(SS)); },
};

export const leads = {
  async list() {
    if (!live) return demoAll().slice().sort((a, b) => b.created_at.localeCompare(a.created_at));
    return sb('/rest/v1/leads?select=*&order=created_at.desc', {}, token());
  },
  async update(id, patch) {
    if (!live) { const a = demoAll(); const i = a.findIndex((x) => x.id === id); if (i < 0) return; a[i] = { ...a[i], ...patch }; demoWrite(a); return a[i]; }
    const [row] = await sb(`/rest/v1/leads?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(patch) }, token());
    return row;
  },
  async setStatus(lead, status) {
    const history = [...(lead.history || []), { at: now(), status }];
    return this.update(lead.id, { status, history });
  },
  // Called by the public quote form.
  async add(lead) {
    const row = { status: 'new', history: [{ at: now(), status: 'new' }], owner_notes: '', estimate: '', ...lead };
    if (!live) { const a = demoAll(); a.push({ id: 'd' + Date.now().toString(36), created_at: now(), ...row }); demoWrite(a); return; }
    await sb('/rest/v1/leads', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(row) });
  },
  resetDemo() { demoWrite(seed()); },
};
