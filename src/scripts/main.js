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
  loop.shp = [...document.querySelectorAll('.shp')];
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
      for (const el of loop.shp) {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -150 || r.top > innerHeight + 150) continue;
        el.style.setProperty('--sy', ((r.top + r.height / 2 - innerHeight / 2) * Number(el.dataset.depth || 0)).toFixed(1) + 'px');
        el.style.setProperty('--sr', (y * Number(el.dataset.spin || 0.03)).toFixed(1));
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
    let n = 0;
    figs.forEach((fig) => {
      fig.hidden = !(f === 'all' || fig.dataset.tags.split(' ').includes(f));
      fig.classList.remove('pop');
      if (!fig.hidden) { void fig.offsetWidth; fig.style.setProperty('--i', String(Math.min(n++, 12))); fig.classList.add('pop'); }
    });
  }));

  const dlg = document.querySelector('dialog.lb');
  if (!dlg) return;
  const img = dlg.querySelector('img');
  const cap = dlg.querySelector('[data-cap]');
  let list = [], idx = 0;
  const show = (i) => {
    idx = (i + list.length) % list.length;
    const b = list[idx];
    img.classList.remove('swap'); void img.offsetWidth; img.classList.add('swap');
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

  // Extra questions appear only for the services they belong to.
  const when = () => {
    const picked = [...form.querySelectorAll('input[name="service"]:checked')].map((c) => c.value);
    form.querySelectorAll('[data-when]').forEach((f) => { f.hidden = !f.dataset.when.split(',').some((id) => picked.includes(id)); });
    form.querySelector('[data-services-err]').hidden = true;
  };
  form.querySelectorAll('input[name="service"]').forEach((c) => c.addEventListener('change', when));
  when();

  const label = (id) => form.querySelector(`input[value="${CSS.escape(id)}"]`)?.nextElementSibling?.textContent || id;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const services = d.getAll('service');
    if (!services.length) {
      const err = form.querySelector('[data-services-err]'); err.hidden = false;
      form.querySelector('[data-services]').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const v = (k) => String(d.get(k) || '').trim();
    const lines = ['Hi Supreme AutoSpa, I would like a quote.', ''];
    const add = (k, val) => { if (val) lines.push(`${k}: ${val}`); };
    lines.push('CONTACT');
    add('Name', v('name')); add('Mobile', v('phone')); add('Email', v('email')); add('Best way to reach me', v('contact'));
    lines.push('', 'VEHICLE');
    add('Type', v('vtype')); add('Vehicle', [v('year'), v('make'), v('model')].filter(Boolean).join(' ')); add('Color', v('color'));
    add('Paint condition', v('paint')); add('Interior condition', v('interior'));
    lines.push('', 'SERVICES WANTED');
    services.forEach((id) => lines.push('- ' + label(id)));
    if (services.includes('repaint')) { lines.push('', 'REPAINTING'); add('Scope', v('repaint_scope')); add('Color', v('repaint_color')); add('Areas', v('repaint_areas')); }
    if (services.includes('ceramic') || services.includes('graphene')) { lines.push('', 'COATING'); add('Existing coating', v('has_coating')); }
    if (services.includes('pms')) { lines.push('', 'MAINTENANCE'); add('Odometer', v('odometer') && v('odometer') + ' km'); add('Last PMS', v('last_pms')); add('Concerns', v('concerns')); }
    if (v('date') || v('slot') || v('urgency')) { lines.push('', 'SCHEDULE'); add('Preferred date', v('date')); add('Preferred time', v('slot')); add('Needed', v('urgency')); }
    if (v('notes')) { lines.push('', 'NOTES', v('notes')); }
    lines.push('', d.get('photos') ? 'I will send photos of the vehicle.' : 'I can send photos if needed.');
    lines.push('I understand the quote is a rough estimate, and that a more accurate quotation needs a physical check of the vehicle.');
    const msg = lines.join('\n');
    pre.textContent = msg;
    const enc = encodeURIComponent(msg);
    out.querySelector('[data-mail]').href = `mailto:${form.dataset.email}?subject=${encodeURIComponent('Quote request: ' + [v('make'), v('model')].filter(Boolean).join(' '))}&body=${enc}`;
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

function initTop() {
  const t = document.querySelector('.totop'); if (!t) return;
  const on = () => t.classList.toggle('is-on', scrollY > 700);
  on(); addEventListener('scroll', on, { passive: true });
  t.addEventListener('click', () => scrollTo({ top: 0, behavior: REDUCED() ? 'auto' : 'smooth' }));
  document.addEventListener('astro:before-swap', () => removeEventListener('scroll', on), { once: true });
}

function init() {
  closeMenu();
  initTop();
  initReveals();
  initStatus();
  initMotion();
  initReel();
  initServiceTips();
  initGallery();
  initQuote();
}

document.addEventListener('astro:page-load', init);

// Click ripple on buttons and chips.
if (!window.__ripple) {
  window.__ripple = true;
  document.addEventListener('pointerdown', (e) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const host = e.target.closest?.('.btn, .jump a, .chips span, .filters button, .tabs button');
    if (!host) return;
    const r = host.getBoundingClientRect();
    const d = Math.max(r.width, r.height) * 2.2;
    const el = document.createElement('span');
    el.className = 'ripple';
    el.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left}px;top:${e.clientY - r.top}px`;
    host.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }, { passive: true });
}
