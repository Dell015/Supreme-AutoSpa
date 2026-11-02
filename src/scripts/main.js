// Small, dependency-free behaviour. Everything degrades: without JS the page is fully visible and readable.

function initReveals() {
  const els = document.querySelectorAll('[data-reveal], [data-wipe], .slip');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          (e.target.__reveal || e.target).classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );
  // A fully clipped element (clip-path) never reports as visible, so watch its parent instead.
  els.forEach((el) => {
    if (el.hasAttribute('data-wipe') && el.parentElement) { el.parentElement.__reveal = el; io.observe(el.parentElement); }
    else io.observe(el);
  });
  // Safety net: never leave content hidden if something odd happens.
  setTimeout(() => els.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in');
  }), 2500);
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
  document.querySelectorAll('.svc__col li button').forEach((b) => {
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
  const q = new URLSearchParams(location.search).get('service');
  if (q) q.split(',').forEach((id) => { const c = form.querySelector(`input[value="${CSS.escape(id)}"]`); if (c) c.checked = true; });

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
  initReel();
  initServiceTips();
  initGallery();
  initQuote();
}

document.addEventListener('astro:page-load', init);
