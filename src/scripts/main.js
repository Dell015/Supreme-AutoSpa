// Small, dependency-free behaviour. Everything degrades: without JS the page is fully visible and readable.

const REDUCED = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveals play in both directions: content leaves and re-enters from whichever side you scroll toward.
function initReveals() {
  const els = document.querySelectorAll('[data-reveal], [data-wipe], .slip');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = e.target.__reveal || e.target;
        if (e.isIntersecting) el.classList.add('is-in');
        else {
          el.dataset.from = e.boundingClientRect.top < 0 ? 'top' : 'bottom';
          el.classList.remove('is-in');
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
  );
  // A fully clipped element never reports as visible, so a wipe is watched through its parent.
  els.forEach((el) => {
    if (el.hasAttribute('data-wipe') && el.parentElement) { el.parentElement.__reveal = el; io.observe(el.parentElement); }
    else io.observe(el);
  });
  setTimeout(() => els.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in');
  }), 2500);
}

let loop = { id: 0, vel: 0, last: 0, marqs: [], par: [], drift: [], y: 0 };
function initMotion() {
  cancelAnimationFrame(loop.id);
  const root = document.documentElement;
  const bar = document.querySelector('.nav');
  document.querySelectorAll('.work .ph img, .place__photo img, .hero__photo img, .about__photos img, .svcpage__side img').forEach((i) => { if (!i.dataset.parallax) i.dataset.parallax = '0.06'; });
  loop.slide = [...document.querySelectorAll('[data-slide]')];
  loop.par = [...document.querySelectorAll('[data-parallax]')];
  loop.drift = [...document.querySelectorAll('[data-drift]')];
  loop.marqs = [...document.querySelectorAll('[data-marquee]')].map((el) => ({ el, track: el.firstElementChild, pos: 0, dir: Number(el.dataset.dir || -1) }));
  loop.last = scrollY; loop.vel = 0;
  const reduced = REDUCED();

  const frame = () => {
    const y = scrollY;
    const dy = y - loop.last; loop.last = y;
    loop.vel += (dy - loop.vel) * 0.18;
    const max = document.documentElement.scrollHeight - innerHeight;
    root.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : '0');
    bar?.classList.toggle('is-scrolled', y > 24);
    if (!reduced) {
      for (const el of loop.par) {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) continue;
        const d = r.top + r.height / 2 - innerHeight / 2;
        const lim = r.height * 0.07;
        const v = Math.max(-lim, Math.min(lim, -d * Number(el.dataset.parallax || 0.06)));
        el.style.setProperty('--py', v.toFixed(1) + 'px');
      }
      for (const el of loop.slide) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > innerHeight + 100) continue;
        el.style.setProperty('--dx', ((r.top + r.height / 2 - innerHeight / 2) * Number(el.dataset.slide)).toFixed(1) + 'px');
      }
      for (const el of loop.drift) el.style.setProperty('--dx', Math.min(y, innerHeight) * Number(el.dataset.drift) + 'px');
      for (const m of loop.marqs) {
        const r = m.el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        const setW = m.track.scrollWidth / 4;
        // Base drift plus scroll velocity: scrolling down speeds it up, scrolling up runs it backwards.
        m.pos += m.dir * (0.7 + loop.vel * 0.55);
        m.pos = ((m.pos % setW) + setW) % setW;
        m.track.style.transform = `translate3d(${-m.pos}px,0,0)`;
      }
    }
    loop.id = requestAnimationFrame(frame);
  };
  loop.id = requestAnimationFrame(frame);

  // Hex lights follow the pointer, like the ceiling at the shop.
  document.querySelectorAll('[data-lit]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', e.clientX - r.left + 'px');
      el.style.setProperty('--my', e.clientY - r.top + 'px');
      el.classList.add('is-lit');
    });
    el.addEventListener('pointerleave', () => el.classList.remove('is-lit'));
  });
}

// ---- Service selection: one list shared by the finder, the services page, the quote form and the nav badges.
const KEY = 'sas-selected';
const getSel = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch { return []; } };
const setSel = (a) => { try { sessionStorage.setItem(KEY, JSON.stringify(a)); } catch {} syncSel(); };
function syncSel() {
  const sel = getSel();
  document.querySelectorAll('[data-svc]').forEach((b) => b.setAttribute('aria-pressed', String(sel.includes(b.dataset.svc))));
  const href = sel.length ? `/quote?service=${sel.join(',')}` : '/quote';
  document.querySelectorAll('[data-quote-link]').forEach((a) => { a.setAttribute('href', href); });
  document.querySelectorAll('[data-badge]').forEach((b) => { b.hidden = !sel.length; b.textContent = sel.length; });
  document.querySelectorAll('[data-count-label]').forEach((l) => { l.textContent = sel.length ? `${sel.length} selected` : 'Tap services to add them'; });
  document.querySelectorAll('[data-quote-bar]').forEach((b) => { b.dataset.on = sel.length ? 'true' : 'false'; });
  document.querySelectorAll('.quote form input[name="service"]').forEach((c) => { c.checked = sel.includes(c.value); });
}
function toggleSvc(id) { const s = getSel(); setSel(s.includes(id) ? s.filter((x) => x !== id) : [...s, id]); }

function initFinder() {
  const dlg = document.querySelector('dialog[data-finder]');
  const open = () => { const d = document.querySelector('dialog[data-finder]'); if (!d || d.open) return; d.showModal(); d.querySelector('[data-q]')?.focus({ preventScroll: true }); };
  document.querySelectorAll('[data-open-finder]').forEach((el) => {
    if (el.dataset.bound) return; el.dataset.bound = '1';
    el.addEventListener('click', (e) => {
      if (el.tagName === 'A' && location.pathname.replace(/\/$/, '') === '/services') return; // already on the full list
      e.preventDefault(); open();
    });
  });
  if (dlg) {
    dlg.querySelector('[data-finder-close]').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.querySelector('[data-quote-link]').addEventListener('click', () => dlg.close());
  }
  document.querySelectorAll('[data-svc]').forEach((b) => b.addEventListener('click', () => toggleSvc(b.dataset.svc)));
  document.querySelectorAll('[data-filter-root]').forEach((root) => {
    const q = root.querySelector('[data-q]'); const tabs = [...root.querySelectorAll('[data-tab]')];
    const items = [...root.querySelectorAll('[data-item]')]; const none = root.querySelector('.finder__none, [data-none]');
    let tab = 'all';
    const apply = () => {
      const t = (q?.value || '').trim().toLowerCase(); let n = 0;
      items.forEach((li) => { const ok = (tab === 'all' || li.dataset.group === tab) && (!t || li.dataset.search.includes(t)); li.hidden = !ok; if (ok) n++; });
      if (none) none.hidden = n > 0;
    };
    q?.addEventListener('input', apply);
    tabs.forEach((b) => b.addEventListener('click', () => { tab = b.dataset.tab; tabs.forEach((x) => x.setAttribute('aria-pressed', String(x === b))); apply(); }));
  });
  const fromUrl = new URLSearchParams(location.search).get('service');
  if (fromUrl && location.pathname.startsWith('/quote')) setSel([...new Set([...getSel(), ...fromUrl.split(',')])]);
  syncSel();
}

function initStatus() {
  document.querySelectorAll('[data-status]').forEach((el) => {
    const opens = Number(el.dataset.opens);
    const closes = Number(el.dataset.closes);
    let hour = 0, minute = 0;
    try {
      const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Manila', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      hour = Number(parts.find((p) => p.type === 'hour').value) % 24;
      minute = Number(parts.find((p) => p.type === 'minute').value);
    } catch { return; }
    const open = hour >= opens && hour < closes;
    const label = el.querySelector('[data-status-label]');
    el.dataset.state = open ? 'open' : 'closed';
    if (label) label.textContent = open ? `Open now, until ${closes > 12 ? closes - 12 : closes}:00 PM` : `Closed now, opens ${opens}:00 AM`;
  });
}

function initReel() {
  document.querySelectorAll('.reel').forEach((reel) => {
    let down = false, startX = 0, startLeft = 0, moved = false;
    reel.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; startX = e.clientX; startLeft = reel.scrollLeft;
    });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) { moved = true; reel.classList.add('is-drag'); }
      reel.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', () => { down = false; reel.classList.remove('is-drag'); });
    reel.addEventListener('click', (e) => { if (moved) e.preventDefault(); }, true);
  });
}

function initServiceTips() {
  const tip = document.querySelector('[data-tip]');
  if (!tip) return;
  const fallback = tip.dataset.fallback || '';
  const set = (t) => { tip.textContent = t || fallback; tip.dataset.empty = t ? 'false' : 'true'; };
  document.querySelectorAll('.svc__col li button[data-text]').forEach((b) => {
    b.addEventListener('mouseenter', () => set(b.dataset.text));
    b.addEventListener('focus', () => set(b.dataset.text));
    b.addEventListener('mouseleave', () => set(''));
    b.addEventListener('blur', () => set(''));
  });
  set('');
}

function initGallery() {
  const root = document.querySelector('[data-gallery]');
  if (!root) return;
  const figs = [...root.querySelectorAll('figure')];
  const buttons = document.querySelectorAll('[data-filter]');
  buttons.forEach((btn) => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    figs.forEach((fig) => { fig.hidden = !(f === 'all' || fig.dataset.tags.split(' ').includes(f)); });
  }));

  const dlg = document.querySelector('dialog.lb');
  if (!dlg) return;
  const img = dlg.querySelector('img');
  const cap = dlg.querySelector('[data-cap]');
  let list = [], idx = 0;
  const show = (i) => {
    idx = (i + list.length) % list.length;
    const b = list[idx];
    img.src = b.dataset.full; img.alt = b.dataset.alt; cap.textContent = b.dataset.caption;
  };
  root.querySelectorAll('figure button').forEach((b) => b.addEventListener('click', () => {
    list = [...root.querySelectorAll('figure:not([hidden]) button')];
    show(list.indexOf(b));
    dlg.showModal();
  }));
  dlg.querySelector('[data-prev]').addEventListener('click', () => show(idx - 1));
  dlg.querySelector('[data-next]').addEventListener('click', () => show(idx + 1));
  dlg.querySelector('[data-close]').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
}

function initQuote() {
  const form = document.querySelector('[data-quote]');
  if (!form) return;
  const out = document.querySelector('[data-result]');
  const pre = out.querySelector('pre');
  form.querySelectorAll('input[name="service"]').forEach((c) => c.addEventListener('change', () => setSel([...form.querySelectorAll('input[name="service"]:checked')].map((x) => x.value))));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const services = d.getAll('service');
    const lines = ['Hi Supreme AutoSpa, I would like a quote.'];
    const add = (k, v) => { if (v && String(v).trim()) lines.push(`${k}: ${String(v).trim()}`); };
    add('Name', d.get('name'));
    add('Phone', d.get('phone'));
    add('Vehicle', [d.get('vehicle'), d.get('vtype')].filter(Boolean).join(', '));
    add('Services', services.join(', '));
    add('Preferred day and time', d.get('when'));
    add('Notes', d.get('notes'));
    lines.push('I can send photos of the vehicle if needed.');
    const msg = lines.join('\n');
    pre.textContent = msg;
    const enc = encodeURIComponent(msg);
    out.querySelector('[data-mail]').href = `mailto:${form.dataset.email}?subject=${encodeURIComponent('Quote request')}&body=${enc}`;
    out.querySelector('[data-sms]').href = `sms:${form.dataset.sms}?&body=${enc}`;
    out.hidden = false;
    out.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    out.querySelector('h2').focus({ preventScroll: true });
    // Lead capture hook. Set data-endpoint on the form to store requests once a backend exists.
    if (form.dataset.endpoint) {
      fetch(form.dataset.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg, services, fields: Object.fromEntries(d) }), keepalive: true }).catch(() => {});
    }
  });

  const copy = out.querySelector('[data-copy]');
  const flash = (t) => { const o = copy.dataset.label; copy.textContent = t; setTimeout(() => (copy.textContent = o), 2200); };
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(pre.textContent); flash('Copied'); } catch { flash('Press and hold the text to copy'); }
  });
  out.querySelector('[data-messenger]').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(pre.textContent); } catch {}
  });
}

function closeMenu() { document.querySelectorAll('.nav__menu[open]').forEach((d) => d.removeAttribute('open')); }

function init() {
  closeMenu();
  initReveals();
  initStatus();
  initMotion();
  initFinder();
  initReel();
  initServiceTips();
  initGallery();
  initQuote();
}

document.addEventListener('astro:page-load', init);
