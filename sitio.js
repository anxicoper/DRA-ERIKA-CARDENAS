(function () {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  /* TODO antes de publicar: volver a respetar prefers-reduced-motion */
  var still = /[?&]still/.test(location.search);
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var phone = window.matchMedia('(max-width: 860px)').matches;
  var fine = window.matchMedia('(hover: hover)').matches;
  var animate = hasGsap && !still;
  var lenis = null;

  /* ---------- cosas que funcionan siempre, con o sin animaciones ---------- */

  /* comparador antes / después */
  (function () {
    var box = $('#ba'); if (!box) return;
    var range = $('.ba__range', box), stage = $('.ba__stage', box);
    var set = function (v) { stage.style.setProperty('--p', v + '%'); };
    set(range.value);
    range.addEventListener('input', function () { set(range.value); });
  })();

  /* reseñas reales de Google */
  function buildReviews() {
    var host = $('#rv'); var data = window.RESENAS || [];
    if (!host || !data.length) return;
    var c = data.filter(function (r) { return r.s === 'Cúcuta'; }), p = data.filter(function (r) { return r.s === 'Pamplona'; });
    var mix = [], i = 0; while (i < c.length || i < p.length) { if (c[i]) mix.push(c[i]); if (c[i + 1]) mix.push(c[i + 1]); if (p[i]) mix.push(p[i]); i += 2; }
    var nrows = phone ? 2 : 3;
    var rows = []; for (var r0 = 0; r0 < nrows; r0++) rows.push([]);
    mix.forEach(function (r, k) { rows[k % nrows].push(r); });
    var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    var card = function (r) { return '<article class="rv__card"><div class="rv__stars" aria-label="5 estrellas">★★★★★</div><p class="rv__txt" data-full="' + esc(r.t).replace(/"/g, '&quot;') + '">' + esc(r.t) + '</p>' + (r.t.length > 230 ? '<span class="rv__more">Leer completa</span>' : '') + '<div class="rv__who"><b>' + esc(r.n || 'Paciente') + '</b><span>Google · ' + r.s + '</span></div></article>'; };
    var auto = animate && !phone;
    rows.forEach(function (list, k) {
      var el = document.createElement('div'); el.className = 'rv__row' + (auto ? '' : ' rv__row--swipe');
      el.innerHTML = (auto ? list.concat(list) : list).map(card).join('');
      host.appendChild(el);
      if (!auto) return;
      var tw = k % 2 ? gsap.fromTo(el, { xPercent: -50 }, { xPercent: 0, ease: 'none', duration: 120 + k * 20, repeat: -1 }) : gsap.fromTo(el, { xPercent: 0 }, { xPercent: -50, ease: 'none', duration: 120 + k * 20, repeat: -1 });
      el.addEventListener('mouseenter', function () { gsap.to(tw, { timeScale: 0.1, duration: 0.5 }); });
      el.addEventListener('mouseleave', function () { gsap.to(tw, { timeScale: 1, duration: 0.5 }); });
    });
    var m = $('#rvm');
    var close = function () { m.classList.remove('is-on'); if (lenis) lenis.start(); };
    host.addEventListener('click', function (e) {
      var cd = e.target.closest('.rv__card'); if (!cd) return;
      $('#rvt').textContent = cd.querySelector('.rv__txt').dataset.full;
      $('#rvw').innerHTML = cd.querySelector('.rv__who').innerHTML;
      m.classList.add('is-on'); if (lenis) lenis.stop();
    });
    m.addEventListener('click', function (e) { if (e.target === m || e.target.tagName === 'BUTTON') close(); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }
  buildReviews();

  /* menú del celular */
  (function () {
    var b = $('.pill__menu'), m = $('#menum'); if (!b || !m) return;
    var set = function (open) { m.classList.toggle('is-on', open); b.setAttribute('aria-expanded', open); if (lenis) { open ? lenis.stop() : lenis.start(); } };
    b.addEventListener('click', function () { set(!m.classList.contains('is-on')); });
    m.addEventListener('click', function (e) { if (e.target.tagName === 'A') set(false); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  })();

  /* el botón flotante de WhatsApp se aparta de los botones grandes en el celular */
  (function () {
    var wa = $('.wa'); if (!wa || !('IntersectionObserver' in window)) return;
    var seen = {};
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { seen[e.target.dataset.k] = e.isIntersecting; });
      var any = Object.keys(seen).some(function (k) { return seen[k]; });
      wa.classList.toggle('is-off', phone && any);
    }, { threshold: 0.2 });
    $$('.hero__cta,.invita,.sedes__grid,.cierre .btn').forEach(function (el, i) { el.dataset.k = 'k' + i; io.observe(el); });
  })();

  /* destellos sutiles detrás de ella */
  (function () {
    var hero = $('#hero'), cut = $('.hero__cut'); if (!hero || !cut) return;
    var host = document.createElement('div'); host.className = 'hero__sparks'; host.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < (phone ? 14 : 22); i++) {
      var s = document.createElement('i'); var size = 2 + Math.random() * 4;
      s.style.cssText = 'left:' + (46 + Math.random() * 52) + '%;top:' + (6 + Math.random() * 84) + '%;width:' + size + 'px;height:' + size + 'px;animation-delay:' + (-Math.random() * 6).toFixed(2) + 's;animation-duration:' + (3 + Math.random() * 4).toFixed(2) + 's';
      host.appendChild(s);
    }
    hero.insertBefore(host, cut);
  })();

  /* ---------- versión quieta: sin animaciones, todo se ve completo ---------- */
  var staticMode = function () {
    var r = $('.giant__reveal');
    if (r) { r.style.clipPath = 'none'; r.style.position = 'relative'; r.style.padding = '96px 24px'; }
    var g = $('.giant'); if (g) g.style.height = 'auto';
    var gs = $('.giant__stage'); if (gs) gs.style.height = 'auto';
    var gw = $('.giant__word'); if (gw) gw.style.display = 'none';
    var tp = $('.trat__pin'); if (tp) tp.style.height = 'auto';
    var tt = $('.trat__track'); if (tt) { tt.style.overflowX = 'auto'; }
    $$('.marq').forEach(function (m) { m.style.overflowX = 'auto'; });
    $$('.marq__row').forEach(function (row) { row.style.width = 'max-content'; });
  };
  if (!animate) { staticMode(); return; }

  gsap.registerPlugin(ScrollTrigger);

  /* desplazamiento suave */
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        var el = id.length > 1 ? $(id) : null;
        if (el || id === '#top') { e.preventDefault(); lenis.scrollTo(el || 0, { offset: el ? (phone ? -72 : -20) : 0 }); }
      });
    });
  }

  /* entrada: las letras suben y se asientan; ella aparece desde abajo */
  $$('.hero__title .row > *').forEach(function (el) {
    var out = '';
    el.textContent.split(' ').forEach(function (w, i, arr) {
      out += '<span class="w">' + w.split('').map(function (c) { return '<span class="ch">' + c + '</span>'; }).join('') + '</span>' + (i < arr.length - 1 ? ' ' : '');
    });
    el.innerHTML = out;
  });
  var intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  intro
    .from('.hero__glow', { opacity: 0, scale: 0.7, duration: 1.6, ease: 'power2.out' }, 0)
    .from('.hero__ring', { opacity: 0, scale: 0.6, duration: 1.6, ease: 'power3.out' }, 0.1)
    .from('.hero__cut', { yPercent: 14, opacity: 0, scale: 1.08, filter: 'blur(22px) drop-shadow(0 30px 50px rgba(0,0,0,.45))', duration: 1.4, ease: 'power3.out' }, 0.2)
    .from('.hero__title .row--l .ch', { xPercent: -140, opacity: 0, rotate: -8, duration: 0.9, stagger: 0.04 }, 0.3)
    .from('.hero__title .row--r .ch', { xPercent: 140, opacity: 0, rotate: 8, duration: 0.9, stagger: 0.04 }, 0.5)
    .from('.hero__eye', { y: 16, opacity: 0, duration: 0.7 }, 0.6)
    .from('.hb', { scale: 0.4, opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'back.out(1.8)' }, 0.9)
    .from('.hero__sub', { y: 24, opacity: 0, duration: 0.7 }, 1.0)
    .from('.hero__cta > *', { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 }, 1.1)
    .from('.pill > *', { y: -30, opacity: 0, duration: 0.7, stagger: 0.1 }, 0.5);
  gsap.to('.hero__cut', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__title', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  if (fine) {
    var hx = function (sel, k) { return { x: gsap.quickTo(sel, 'x', { duration: 1.2, ease: 'power3.out' }), y: gsap.quickTo(sel, 'y', { duration: 1.2, ease: 'power3.out' }), k: k }; };
    var layers = [hx('.hero__cut', -18), hx('.hero__title', 26), hx('.hero__glow', 40), hx('.hb1', -50), hx('.hb2', -34), hx('.hb3', -44)];
    $('#hero').addEventListener('mousemove', function (e) {
      var nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
      layers.forEach(function (l) { l.x(nx * l.k); l.y(ny * l.k * 0.6); });
    });
  }

  /* la palabra crece y se abre un círculo que muestra la frase */
  gsap.timeline({ scrollTrigger: { trigger: '.giant', start: 'top top', end: (phone ? '+=120%' : '+=170%'), pin: true, scrub: 0.7 } })
    .fromTo('.giant__word', { scale: 0.55, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out' })
    .to('.giant__word', { scale: (phone ? 4 : 8), opacity: 0, duration: 1.2, ease: 'power2.in' }, 0.8)
    .fromTo('.giant__reveal', { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(150% at 50% 50%)', duration: 1.3, ease: 'power2.inOut' }, 0.95)
    .from('.bd', { scale: 0.5, opacity: 0, y: 40, rotate: -4, stagger: 0.25, duration: 0.6, ease: 'back.out(1.7)' }, 1.9)
    .from('.giant__small', { y: 30, opacity: 0, duration: 0.6 }, 2.6)
    .to({}, { duration: 0.5 });

  /* tratamientos: recorrido horizontal en escritorio; en celular se desliza con el dedo */
  var track = $('.trat__track');
  if (!phone) {
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    gsap.to(track, {
      x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: { trigger: '.trat', start: 'top top', end: function () { return '+=' + (dist() + window.innerHeight * 0.4); }, pin: '.trat__pin', scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 }
    });
    $$('.panel').forEach(function (p) {
      gsap.fromTo(p, { rotateY: -16, y: 30, transformPerspective: 1400 }, { rotateY: 6, y: -10, transformPerspective: 1400, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: gsap.getTweensOf(track)[0], start: 'left 95%', end: 'right 5%', scrub: true } });
    });
  } else {
    var hint = $('.trat__hint');
    if (hint) track.addEventListener('scroll', function () { hint.style.opacity = track.scrollLeft > 20 ? 0 : 1; }, { passive: true });
  }

  /* galería: dos filas que corren en direcciones opuestas (en celular se deslizan con el dedo) */
  if (!phone) {
    var rowA = $('.marq--a .marq__row'), rowB = $('.marq--b .marq__row');
    [rowA, rowB].forEach(function (row) { row.innerHTML += row.innerHTML + row.innerHTML + row.innerHTML; });
    var tA = gsap.fromTo(rowA, { xPercent: 0 }, { xPercent: -50, ease: 'none', duration: 22, repeat: -1 });
    var tB = gsap.fromTo(rowB, { xPercent: -50 }, { xPercent: 0, ease: 'none', duration: 26, repeat: -1 });
    ScrollTrigger.create({ trigger: '.galeria', start: 'top bottom', end: 'bottom top', onUpdate: function (s) { var v = Math.min(Math.abs(s.getVelocity()) / 400, 4); gsap.to([tA, tB], { timeScale: 1 + v, duration: 0.3, overwrite: true }); } });
  } else {
    $$('.marq').forEach(function (m) { m.style.overflowX = 'auto'; });
    $$('.marq__row').forEach(function (row) { row.style.width = 'max-content'; });
  }
  gsap.from('.galeria__head > *', { y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.galeria__head', start: 'top 80%' } });
  gsap.from('.ba', { y: 60, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.ba', start: 'top 85%' } });
  gsap.from('.feat', { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.feat', start: 'top 85%' } });

  /* contadores de las cifras */
  $$('[data-count]').forEach(function (el) {
    var end = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || 0, 10), suf = el.dataset.suf || '', pre = el.dataset.pre || '';
    var o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: function () { el.textContent = pre + o.v.toFixed(dec).replace('.', ',') + suf; } });
  });

  /* revelados */
  gsap.from('.step', { y: 70, rotateX: -25, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.cita__grid', start: 'top 82%' } });
  gsap.from('.sede', { y: 80, rotateX: -20, opacity: 0, stagger: 0.15, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.sedes__grid', start: 'top 82%' } });
  gsap.from('.sobre__txt > *', { y: 36, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.sobre', start: 'top 65%' } });
  gsap.fromTo('.sobre__img img', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.sobre', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.fq', { y: 30, opacity: 0, stagger: 0.07, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.faq__list', start: 'top 85%' } });
  gsap.from('.invita', { y: 60, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.invita', start: 'top 85%' } });
  gsap.from('.cierre__t span', { yPercent: 80, opacity: 0, rotate: 3, stagger: 0.15, duration: 0.9, ease: 'power4.out', scrollTrigger: { trigger: '.cierre', start: 'top 70%' } });

  /* solo con mouse: inclinación en 3D, botones imantados y cursor */
  if (fine) {
    $$('[data-tilt]').forEach(function (el) {
      var rx = gsap.quickTo(el, 'rotateX', { duration: 0.6, ease: 'power3.out' });
      var ry = gsap.quickTo(el, 'rotateY', { duration: 0.6, ease: 'power3.out' });
      gsap.set(el, { transformPerspective: 900 });
      el.addEventListener('mousemove', function (e) {
        var b = el.getBoundingClientRect();
        ry(((e.clientX - b.left) / b.width - 0.5) * 14);
        rx(-((e.clientY - b.top) / b.height - 0.5) * 14);
      });
      el.addEventListener('mouseleave', function () { rx(0); ry(0); });
    });
    $$('.magnetic').forEach(function (el) {
      var x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      var y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      el.addEventListener('mousemove', function (e) {
        var b = el.getBoundingClientRect();
        x((e.clientX - (b.left + b.width / 2)) * 0.28);
        y((e.clientY - (b.top + b.height / 2)) * 0.28);
      });
      el.addEventListener('mouseleave', function () { x(0); y(0); });
    });
    var c = $('.cursor');
    var cx = gsap.quickTo(c, 'x', { duration: 0.25, ease: 'power3.out' });
    var cy = gsap.quickTo(c, 'y', { duration: 0.25, ease: 'power3.out' });
    window.addEventListener('mousemove', function (e) { c.classList.add('is-on'); cx(e.clientX); cy(e.clientY); });
    $$('a, button, [data-tilt]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { c.classList.add('is-big'); });
      el.addEventListener('mouseleave', function () { c.classList.remove('is-big'); });
    });
  }

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
