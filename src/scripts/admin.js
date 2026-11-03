import { auth, leads, live, STATUSES } from '../lib/store.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const body = document.body;
const SMS = body.dataset.sms, MSGR = body.dataset.messenger;
const LABEL = { new: 'New', replied: 'Replied', scheduled: 'Scheduled', done: 'Done', closed: 'Closed' };
let all = [], filter = 'all', query = '', openId = null;

const first = (n) => String(n || '').replace(/^Sample:\s*/i, '').split(' ')[0] || 'there';
const ago = (iso) => {
  const m = Math.max(1, Math.round((Date.now() - new Date(iso)) / 60000));
  if (m < 60) return m + ' min ago';
  const h = Math.round(m / 60); if (h < 24) return h + ' hr ago';
  const d = Math.round(h / 24); return d + (d === 1 ? ' day ago' : ' days ago');
};
const when = (iso) => new Date(iso).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const hoursSince = (iso) => (Date.now() - new Date(iso)) / 3600e3;
const lastChange = (l) => (l.history?.length ? l.history[l.history.length - 1].at : l.created_at);
const needsFollowUp = (l) => l.status === 'replied' && hoursSince(lastChange(l)) >= 48;
const toast = (t) => { const e = $('[data-toast]'); e.textContent = t; e.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove('on'), 2200); };

// ---------- Reply templates (filled from the request) ----------
const svc = (l) => (l.services?.length ? l.services.join(', ') : 'your request');
const TEMPLATES = [
  { k: 'first', n: 'First reply', t: (l) => `Hi ${first(l.name)}, thanks for choosing Supreme AutoSpa! I received your request for ${svc(l)} on your ${l.vehicle || 'vehicle'}. Could you send 3 to 4 clear photos so I can give you a rough estimate today?` },
  { k: 'photos', n: 'Ask for photos', t: (l) => `Hi ${first(l.name)}, to quote this properly I need clear daylight photos of each side of the ${l.vehicle || 'vehicle'}, plus a close-up of the parts that need work. Send them here whenever ready.` },
  { k: 'estimate', n: 'Rough estimate', t: (l) => `Hi ${first(l.name)}, based on your details, ${svc(l)} for your ${l.vehicle || 'vehicle'} is around ₱____ to ₱____. This is a rough estimate. For the exact price we check the vehicle in person. Are you free to drop by? We are open 6 AM to 7 PM every day.` },
  { k: 'visit', n: 'Confirm the visit', t: (l) => `Great, ${first(l.name)}! See you ${l.details?.Schedule ? l.details.Schedule : '____'} at Roque Menor St, Cauayan City. Look for the sign with the red car. Bring the vehicle as it is, no need to wash it first.` },
  { k: 'final', n: 'Final price', t: (l) => `Hi ${first(l.name)}, we checked the ${l.vehicle || 'vehicle'}. The final price for ${svc(l)} is ₱____, ready by ____. Shall we proceed?` },
  { k: 'follow', n: 'Follow up', t: (l) => `Hi ${first(l.name)}, just checking in on your ${svc(l)} request. Still interested? We can hold a slot for you this week. If the timing is not right, no problem.` },
  { k: 'outscope', n: 'Not something we do', t: (l) => `Thanks for asking, ${first(l.name)}. That one is not something we do, but tell me more about what you need and I can point you in the right direction.` },
  { k: 'thanks', n: 'Thank you and review', t: (l) => `Thank you for trusting us with your ${l.vehicle || 'vehicle'}, ${first(l.name)}! If you are happy with the result, a short review on our Facebook or Google page helps a new shop like ours a lot. See you again!` },
];

// ---------- Views ----------
const show = (id) => {
  ['login', 'app'].forEach((k) => ($(`[data-${k}]`).hidden = k !== id));
  $('[data-signout]').hidden = id !== 'app';
};
const tab = (name) => {
  $$('[data-tab]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tab === name)));
  $$('[data-view]').forEach((v) => (v.hidden = v.dataset.view !== name));
  if (name === 'insights') renderInsights();
};

const matches = (l) => {
  if (filter === 'follow') { if (!needsFollowUp(l)) return false; }
  else if (filter !== 'all' && l.status !== filter) return false;
  if (query) {
    const hay = [l.name, l.vehicle, l.phone, ...(l.services || [])].join(' ').toLowerCase();
    if (!hay.includes(query)) return false;
  }
  return true;
};

function renderFilters() {
  const count = (s) => all.filter((l) => l.status === s).length;
  const f = $('[data-filters]');
  const items = [['all', 'All', all.length], ...STATUSES.map((s) => [s, LABEL[s], count(s)])];
  f.innerHTML = items.map(([k, l, n]) => `<button type="button" data-f="${k}" aria-pressed="${k === filter}">${l}<em>${n}</em></button>`).join('');
  $$('[data-f]', f).forEach((b) => b.addEventListener('click', () => { filter = b.dataset.f; render(); }));
  const nNew = count('new');
  const badge = $('[data-badge]'); badge.textContent = nNew ? String(nNew) : ''; badge.hidden = !nNew;
}

function renderAttention() {
  const nNew = all.filter((l) => l.status === 'new').length;
  const nFollow = all.filter(needsFollowUp).length;
  const el = $('[data-attn]');
  const parts = [];
  if (nNew) parts.push(`<button type="button" class="attn__i attn__i--new" data-f2="new"><b>${nNew}</b><span>new ${nNew === 1 ? 'request' : 'requests'} to answer</span></button>`);
  if (nFollow) parts.push(`<button type="button" class="attn__i" data-f2="follow"><b>${nFollow}</b><span>${nFollow === 1 ? 'customer' : 'customers'} to follow up</span></button>`);
  el.innerHTML = parts.length ? parts.join('') : '<p class="attn__ok">All caught up. Nothing is waiting for you.</p>';
  $$('[data-f2]', el).forEach((b) => b.addEventListener('click', () => { filter = b.dataset.f2; render(); }));
}

function renderList() {
  const rows = all.filter(matches);
  const ul = $('[data-list]');
  $('[data-empty]').hidden = rows.length > 0;
  ul.innerHTML = rows.map((l) => `
    <li><button type="button" class="lrow lrow--${esc(l.status)}" data-open="${esc(l.id)}">
      <span class="lrow__dot" aria-hidden="true"></span>
      <span class="lrow__main">
        <b>${esc(l.name)}</b>
        <span>${esc(l.vehicle || l.vtype || '')}</span>
        <span class="lrow__svc">${esc((l.services || []).slice(0, 3).join(' · '))}${(l.services || []).length > 3 ? ' +' + (l.services.length - 3) : ''}</span>
      </span>
      <span class="lrow__meta"><span class="pill pill--${esc(l.status)}">${LABEL[l.status] || esc(l.status)}</span>${needsFollowUp(l) ? '<span class="pill pill--follow">Follow up</span>' : ''}<time>${ago(l.created_at)}</time></span>
    </button></li>`).join('');
  $$('[data-open]', ul).forEach((b) => b.addEventListener('click', () => openLead(b.dataset.open)));
}

const render = () => { renderFilters(); renderAttention(); renderList(); };

// ---------- Detail sheet ----------
function kv(rows) {
  return rows.filter(([, v]) => v).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
}

function openLead(id) {
  const l = all.find((x) => x.id === id); if (!l) return;
  openId = id;
  const sheet = $('[data-sheet]'), panel = $('[data-panel]');
  const tel = String(l.phone || '').replace(/[^\d+]/g, '');
  const details = Object.entries(l.details || {}).map(([k, v]) => [k, v]);
  panel.innerHTML = `
    <div class="sheet__head">
      <button type="button" class="sheet__back" data-close aria-label="Back to the list">← Back</button>
      <span class="pill pill--${esc(l.status)}">${LABEL[l.status] || esc(l.status)}</span>
    </div>
    <h2 class="sheet__name">${esc(l.name)}</h2>
    <p class="sheet__sub">${esc(l.vehicle || l.vtype || '')} · received ${esc(when(l.created_at))}</p>

    <div class="stat" role="group" aria-label="Change status">
      ${STATUSES.map((s) => `<button type="button" data-status="${s}" aria-pressed="${l.status === s}">${LABEL[s]}</button>`).join('')}
    </div>

    <div class="reach">
      <a class="btn" href="tel:${esc(tel)}">Call</a>
      <a class="btn btn--ghost" href="sms:${esc(tel)}">Text</a>
      <a class="btn btn--ghost" href="${esc(MSGR)}" target="_blank" rel="noopener" data-msgr>Messenger</a>
      ${l.email ? `<a class="btn btn--ghost" href="mailto:${esc(l.email)}">Email</a>` : ''}
    </div>
    <p class="muted">Prefers: ${esc(l.contact || 'not stated')} · ${esc(l.phone || '')}</p>

    <h3>Request</h3>
    <ul class="chips2">${(l.services || []).map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
    <dl class="kv">${kv([['Vehicle type', l.vtype], ['Vehicle', l.vehicle], ['Color', l.color], ['Paint', l.paint], ['Interior', l.interior], ...details, ['Will send photos', l.photos ? 'Yes' : 'Not yet']])}</dl>
    ${l.notes ? `<blockquote class="note">${esc(l.notes)}</blockquote>` : ''}

    <h3>Reply</h3>
    <label class="lab">Template
      <select data-tpl>${TEMPLATES.map((t) => `<option value="${t.k}">${esc(t.n)}</option>`).join('')}</select>
    </label>
    <textarea class="reply" data-reply rows="6" aria-label="Message to the customer"></textarea>
    <p class="muted">Fill the blanks (₱____) before sending.</p>
    <div class="reach">
      <button class="btn" type="button" data-copy>Copy message</button>
      <a class="btn btn--ghost" data-sms href="sms:${esc(tel)}">Send as text</a>
    </div>

    <h3>Private notes</h3>
    <label class="lab">Estimate you gave<input data-estimate value="${esc(l.estimate)}" placeholder="e.g. ₱__ to ₱__" /></label>
    <label class="lab">Notes only you can see<textarea data-notes rows="3" placeholder="e.g. coming Saturday 9 AM">${esc(l.owner_notes)}</textarea></label>

    <h3>History</h3>
    <ol class="hist">${(l.history || []).slice().reverse().map((h) => `<li><b>${LABEL[h.status] || esc(h.status)}</b><time>${esc(when(h.at))}</time></li>`).join('')}</ol>
  `;
  sheet.hidden = false;
  requestAnimationFrame(() => sheet.classList.add('is-open'));
  body.classList.add('lock');

  const reply = $('[data-reply]', panel), tpl = $('[data-tpl]', panel);
  const fill = () => { reply.value = TEMPLATES.find((t) => t.k === tpl.value).t(l); syncSms(); };
  const syncSms = () => { $('[data-sms]', panel).href = `sms:${tel}?&body=${encodeURIComponent(reply.value)}`; };
  // Suggest the next sensible template for the stage the request is in.
  tpl.value = { new: 'first', replied: needsFollowUp(l) ? 'follow' : 'estimate', scheduled: 'visit', done: 'thanks', closed: 'follow' }[l.status] || 'first';
  fill();
  tpl.addEventListener('change', fill);
  reply.addEventListener('input', syncSms);

  const copy = async () => { try { await navigator.clipboard.writeText(reply.value); toast('Message copied'); return true; } catch { reply.select(); toast('Press and hold to copy'); return false; } };
  $('[data-copy]', panel).addEventListener('click', copy);
  $('[data-msgr]', panel).addEventListener('click', copy);

  $$('[data-status]', panel).forEach((b) => b.addEventListener('click', async () => {
    const s = b.dataset.status; if (s === l.status) return;
    const row = await leads.setStatus(l, s);
    Object.assign(l, row || { status: s, history: [...(l.history || []), { at: new Date().toISOString(), status: s }] });
    toast(`Marked ${LABEL[s]}`); render(); openLead(id);
  }));
  const save = async (patch) => { Object.assign(l, patch); try { await leads.update(id, patch); toast('Saved'); } catch { toast('Could not save'); } };
  $('[data-notes]', panel).addEventListener('change', (e) => save({ owner_notes: e.target.value }));
  $('[data-estimate]', panel).addEventListener('change', (e) => save({ estimate: e.target.value }));
  $$('[data-close]', panel).forEach((b) => b.addEventListener('click', closeSheet));
  panel.scrollTop = 0;
}

function closeSheet() {
  const sheet = $('[data-sheet]');
  sheet.classList.remove('is-open'); body.classList.remove('lock'); openId = null;
  setTimeout(() => { if (!openId) sheet.hidden = true; }, 280);
}

// ---------- Insights ----------
function bars(el, rows, max) {
  const m = max || Math.max(1, ...rows.map((r) => r[1]));
  el.innerHTML = rows.length ? rows.map(([k, n]) => `<div class="bar"><span>${esc(k)}</span><i style="--w:${Math.round((n / m) * 100)}%"></i><b>${n}</b></div>`).join('') : '<p class="muted">No data yet.</p>';
}
const tally = (arr) => { const m = new Map(); arr.forEach((k) => k && m.set(k, (m.get(k) || 0) + 1)); return [...m.entries()].sort((a, b) => b[1] - a[1]); };

function renderInsights() {
  const week = all.filter((l) => hoursSince(l.created_at) <= 168).length;
  const done = all.filter((l) => l.status === 'done').length;
  const answered = all.filter((l) => l.status !== 'new');
  const avgH = answered.length ? answered.reduce((a, l) => { const h = (l.history || []).find((x) => x.status !== 'new'); return a + (h ? (new Date(h.at) - new Date(l.created_at)) / 3600e3 : 0); }, 0) / answered.length : 0;
  $('[data-kpis]').innerHTML = [
    [week, 'requests this week'], [all.length, 'requests in total'], [done, 'jobs finished'], [avgH ? (avgH < 1 ? '<1' : Math.round(avgH)) + ' hr' : '–', 'average time to reply'],
  ].map(([n, l]) => `<div class="kpi"><b>${n}</b><span>${l}</span></div>`).join('');
  bars($('[data-bars-status]'), STATUSES.map((s) => [LABEL[s], all.filter((l) => l.status === s).length]));
  bars($('[data-bars-services]'), tally(all.flatMap((l) => l.services || [])).slice(0, 6));
  bars($('[data-bars-vehicles]'), tally(all.map((l) => l.vtype)).slice(0, 6));
}

// ---------- Tools ----------
function csv() {
  const cols = ['created_at', 'status', 'name', 'phone', 'email', 'contact', 'vtype', 'vehicle', 'color', 'paint', 'interior', 'services', 'notes', 'estimate', 'owner_notes'];
  const cell = (v) => { let s = Array.isArray(v) ? v.join('; ') : String(v ?? ''); if (/^[=+\-@]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
  const text = [cols.join(','), ...all.map((l) => cols.map((c) => cell(l[c])).join(','))].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' }));
  a.download = 'supreme-autospa-requests.csv'; a.click(); URL.revokeObjectURL(a.href);
}

// ---------- Boot ----------
async function load() {
  try { all = await leads.list(); } catch (e) { all = []; toast('Could not load requests'); if (live) { auth.signOut(); show('login'); return; } }
  render();
}
async function enter() { show('app'); await load(); tab('inbox'); }

$$('[data-tab]').forEach((b) => b.addEventListener('click', () => tab(b.dataset.tab)));
$('[data-search]').addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); renderList(); });
$('[data-signout]').addEventListener('click', () => { auth.signOut(); closeSheet(); show('login'); });
$('[data-csv]')?.addEventListener('click', csv);
$('[data-reset]')?.addEventListener('click', () => { leads.resetDemo(); load(); toast('Demo reset'); });
$('[data-demo]')?.addEventListener('click', async () => { await auth.signIn(); enter(); });
$('[data-loginform]')?.addEventListener('submit', async (e) => {
  e.preventDefault(); const f = new FormData(e.target), err = $('[data-loginerr]'); err.hidden = true;
  try { await auth.signIn(f.get('email'), f.get('password')); enter(); } catch { err.textContent = 'That email or password did not work.'; err.hidden = false; }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && openId) closeSheet(); });
setInterval(() => { if (auth.signedIn() && !openId && !$('[data-app]').hidden) load(); }, 30000);

if (auth.signedIn()) enter(); else show('login');
