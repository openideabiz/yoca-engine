/*! yOCA+ Visual Engine v2.2.3 | OPENIDEA.biz | generic, brand-driven, Canvas 2D native. Formats: carousel, post, post_square, story, flyer_a5, flyer_a4, brochure_a4, video_story, video_post.
 * Usage: YOCA.render({ brand: BRAND_TOKENS, slides: SLIDES, options: { format, lang, file, mount } })
 * The engine is identical for every client. Every visual decision comes from BRAND_TOKENS.
 * Never edit this code inside a chat. Fill BRAND_TOKENS and SLIDES only.
 */
(function (G) {
  'use strict';
  var W = 1080, H = 1350;

  /* ---------- defaults (neutral; every brand overrides) ---------- */
  var DEFAULT_BRAND = {
    name: 'Brand',
    fonts: {
      display: { family: '', weight: 700, fallback: 'Helvetica, Arial, sans-serif' },
      body: { family: '', weight: 400, bold: 700, fallback: 'Helvetica, Arial, sans-serif' },
      mono: { family: '', weight: 500, fallback: 'Menlo, Consolas, monospace' }
    },
    colors: {
      light_bg: '#FFFFFF', dark_bg: '#1E1E1E',
      ink: '#1E1E1E', ink_dark: '#FFFFFF',
      muted: '#6B6B70', muted_dark: '#D0D0D4',
      accent: '#2F6FEB', accent2: '', line: '#E6E6E8', line_dark: '#3A3A3E',
      neutral: '#D4D4D7', neutral_dark: '#6E6E74', panel: '#F3F3F4', panel_dark: '#2A2A2E'
    },
    layout: { margin: 96, content_top: 126, content_bottom: 1060, progress_y: 1150, min_gap: 44 },
    min_size: { body: 32, caption: 28, mono: 22, title: 48 },
    type_scale: {},
    rhythm: 'bookend_dark',          // bookend_dark | bookend_light | all_light | all_dark | alternate
    texture: { type: 'none', size: 60, alpha: 1, on: 'all' }, // grid | dots | lines | none ; on: all | bookends | internals
    shape: { radius: 0, pill_cta: true },
    emphasis: { title: 'color', body: 'color_underline', dark: 'auto' }, // color | color_underline | underline | box | marker
    kicker: { prefix: '// ', upper: true, font: 'mono' },
    boxes: 'bar',                    // bar | fill | outline
    list_marker: 'number',           // number | circle | square | dash
    progress: { style: 'dots', align: 'left' }, // dots | bar | fraction | none
    strip: null,                     // { colors: [...], height: 16, position: 'bottom' | 'top' }
    frame: 'none',                   // none | corner_ticks | border
    glow: false,
    cover: { title_style: 'plain', align: 'top', logo: 'bottom', image_opacity: 0.18, anchor: '' },
    logo: { url_light: '', url_dark: '', wordmark: null, tagline: '', internal: 'none', text_fallback: true },
    motion: { reveal: 450, stagger: 140, rise: 28, delay: 150, fade: 250 },
    swipe_text: 'SWIPE →',
    cta_url: ''
  };

  var ROLES = {
    cover_setup: { f: 'body', size: 56, lh: 1.15 },
    cover_title: { f: 'display', size: 104, lh: 1.04, track: -0.02 },
    cover_sub: { f: 'body', size: 40, lh: 1.3, min: 'body' },
    kicker: { f: 'mono', size: 26, lh: 1.2, track: 0.12, min: 'mono' },
    title: { f: 'display', size: 68, lh: 1.1, track: -0.01, min: 'title' },
    body: { f: 'body', size: 40, lh: 1.36, min: 'body' },
    statement: { f: 'display', size: 54, lh: 1.16, track: -0.01, min: 'title' },
    item_title: { f: 'display', size: 40, lh: 1.2 },
    item_text: { f: 'body', size: 34, lh: 1.32, min: 'caption' },
    label: { f: 'mono', size: 24, lh: 1.2, track: 0.1, min: 'mono' },
    numeral: { f: 'display', size: 230, lh: 0.92, track: -0.04, fixed: true },
    stat: { f: 'display', size: 200, lh: 0.95, track: -0.04, fixed: true },
    quote: { f: 'body', size: 50, lh: 1.3, style: 'italic' },
    code: { f: 'mono', size: 30, lh: 1.5, min: 'mono', upper: false },
    url: { f: 'mono', size: 24, lh: 1.2, track: 0.04, min: 'mono', upper: false },
    cta_title: { f: 'display', size: 76, lh: 1.07, track: -0.015, min: 'title' },
    button: { f: 'mono', size: 30, lh: 1, track: 0.06, min: 'mono' },
    meta: { f: 'mono', size: 22, lh: 1.2, track: 0.1, fixed: true },
    node: { f: 'display', size: 36, lh: 1.2, min: 'caption' },
    node_text: { f: 'body', size: 30, lh: 1.3, min: 'caption' },
    wordmark: { f: 'display', size: 44, lh: 1, fixed: true },
    tagline: { f: 'mono', size: 20, lh: 1.2, fixed: true }
  };

  var UI = {
    it: { all: 'Scarica tutte (PNG)', one: 'Scarica PNG', ok: 'QA superato', fonts: 'Font non caricati: uso fallback', logo: 'Logo non caricato: serve un URL pubblico che consenta CORS (es. jsDelivr). Il logo non viene sostituito da testo.', loading: 'Caricamento font…', report: 'Copia report QA', pdf: 'Scarica PDF', png300: 'PNG 300 dpi', play: '\u25B6 Anteprima', video: 'Scarica video', recording: 'Registrazione\u2026 tieni la pagina aperta', novideo: 'Questo browser non registra video', working: 'Preparo il PDF\u2026', copied: 'Report copiato: incollalo in chat', fix: 'Correggi solo il blocco yOCA DATA (BRAND e SLIDES), poi ricrea il Canvas con la cornice di SKILL.md senza toccare altro codice.' },
    en: { all: 'Download all (PNG)', one: 'Download PNG', ok: 'QA passed', fonts: 'Fonts not loaded: using fallback', logo: 'Logo not loaded: it needs a public URL that allows CORS (e.g. jsDelivr). The logo is not replaced by text.', loading: 'Loading fonts…', report: 'Copy QA report', pdf: 'Download PDF', png300: 'PNG 300 dpi', play: '\u25B6 Preview', video: 'Download video', recording: 'Recording\u2026 keep this page open', novideo: 'This browser cannot record video', working: 'Building the PDF\u2026', copied: 'Report copied: paste it in the chat', fix: 'Fix only the yOCA DATA block (BRAND and SLIDES), then recreate the Canvas from the SKILL.md shell without touching any other code.' },
    es: { all: 'Descargar todas (PNG)', one: 'Descargar PNG', ok: 'QA superado', fonts: 'Fuentes no cargadas: uso fallback', logo: 'Logo no cargado: necesita una URL pública que permita CORS (p. ej. jsDelivr). El logo no se sustituye por texto.', loading: 'Cargando fuentes…', report: 'Copiar informe QA', pdf: 'Descargar PDF', png300: 'PNG 300 ppp', play: '\u25B6 Vista previa', video: 'Descargar v\u00EDdeo', recording: 'Grabando\u2026 mant\u00E9n la p\u00E1gina abierta', novideo: 'Este navegador no graba v\u00EDdeo', working: 'Preparando el PDF\u2026', copied: 'Informe copiado: pégalo en el chat', fix: 'Corrige solo el bloque yOCA DATA (BRAND y SLIDES) y vuelve a crear el Canvas con el marco de SKILL.md sin tocar otro código.' }
  };

  /* ---------- utils ---------- */
  function isObj(o) { return o && typeof o === 'object' && !Array.isArray(o); }
  function merge(a, b) {
    var out = {}, k;
    for (k in a) out[k] = isObj(a[k]) ? merge(a[k], {}) : a[k];
    if (b) for (k in b) out[k] = (isObj(b[k]) && isObj(a[k])) ? merge(a[k], b[k]) : b[k];
    return out;
  }
  function hexRgb(h) {
    h = String(h || '#000').replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h.slice(0, 6), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(h, a) { var c = hexRgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function lum(h) {
    var c = hexRgb(h).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function contrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function onColor(bg, light, dark) { return contrast(bg, light) >= contrast(bg, dark) ? light : dark; }
  function slug(s) { return String(s || 'carousel').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 40); }
  function rr(ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  }
  function wordCount(s) { return String(s || '').replace(/\*/g, '').split(/\s+/).filter(Boolean).length; }

  /* ---------- environment per slide ---------- */
  function makeEnv(ctx, brand, surface, s, qa) {
    var c = brand.colors, dark = surface === 'dark';
    var e = {
      ctx: ctx, brand: brand, s: s, qa: qa, dark: dark,
      bg: dark ? c.dark_bg : c.light_bg,
      ink: dark ? c.ink_dark : c.ink,
      muted: dark ? c.muted_dark : c.muted,
      line: dark ? c.line_dark : c.line,
      neutral: dark ? c.neutral_dark : c.neutral,
      panel: dark ? c.panel_dark : c.panel,
      accent: c.accent, accent2: c.accent2 || c.accent,
      x: brand.layout.margin, w: W - 2 * brand.layout.margin, r: brand.shape.radius
    };
    // WCAG: text >= 24px (or bold emphasis) is large text -> 3:1; smaller -> 4.5:1
    e.accentText = function (size) {
      var need = size >= 24 ? (brand.emphasis.min_contrast || 3) : 4.5;
      return contrast(e.accent, e.bg) >= need ? e.accent : null;
    };
    e.onAccent = c.on_accent || onColor(c.accent, '#FFFFFF', c.ink);
    return e;
  }

  function fontOf(env, role, over) {
    var R = merge(ROLES[role], (env.brand.type_scale || {})[role] || {});
    if (over) R = merge(R, over);
    var F = env.brand.fonts[R.f] || env.brand.fonts.body;
    if (R.f === 'mono' && !F.family) F = env.brand.fonts.body;
    var boost = (role === 'meta' || role === 'tagline' || role === 'wordmark') ? 1 : (FMT.boost || 1);
    if (/^cover_/.test(role) && boost < 1) boost = 1;
    var size = (R.fixed ? R.size : R.size * env.s) * boost;
    if (R.min) {
      var m = (env.brand.min_size[R.min] || 0) * boost;
      if (size < m) size = m;
    }
    size = Math.round(size);
    var weight = R.weight || F.weight || 400;
    var fam = (F.family ? '"' + F.family + '", ' : '') + (F.fallback || 'sans-serif');
    var boldW = R.f === 'body' ? (F.bold || 700) : Math.max(weight, F.bold || weight);
    return {
      size: size, lh: R.lh, track: (R.track || 0) * size, style: R.style || 'normal', weight: weight,
      css: function (b) { return (R.style || 'normal') + ' ' + (b ? boldW : weight) + ' ' + size + 'px ' + fam; },
      upper: R.upper !== undefined ? !!R.upper : R.f === 'mono'
    };
  }

  function setFont(ctx, f, bold) {
    ctx.font = f.css(bold);
    if ('letterSpacing' in ctx) ctx.letterSpacing = (f.track || 0).toFixed(2) + 'px';
  }

  /* ---------- rich text: *emphasis* (words glue across emphasis marks) ---------- */
  function parse(text, upper) {
    var t = String(text == null ? '' : text);
    if (upper) t = t.toUpperCase();
    var words = [], cur = null, em = false;
    for (var i = 0; i < t.length; i++) {
      var ch = t[i];
      if (ch === '*') { em = !em; continue; }
      if (ch === '\n') { if (cur) { words.push(cur); cur = null; } words.push({ br: true }); continue; }
      if (/\s/.test(ch)) { if (cur) { words.push(cur); cur = null; } continue; }
      if (!cur) cur = { runs: [] };
      var last = cur.runs[cur.runs.length - 1];
      if (last && last.em === em) last.t += ch; else cur.runs.push({ t: ch, em: em });
    }
    if (cur) words.push(cur);
    return words;
  }

  function layoutText(env, text, role, width, over) {
    var ctx = env.ctx, f = fontOf(env, role, over);
    var words = parse(text, f.upper), lines = [[]], lw = [0];
    setFont(ctx, f, false); var space = ctx.measureText(' ').width;
    words.forEach(function (wd) {
      if (wd.br) { lines.push([]); lw.push(0); return; }
      wd.w = 0;
      wd.runs.forEach(function (r) { setFont(ctx, f, r.em); r.w = ctx.measureText(r.t).width; wd.w += r.w; });
      if (wd.w > width + 0.5) env.qa.push({ level: 'error', msg: 'Word wider than box: "' + wd.runs.map(function (r) { return r.t; }).join('') + '"' });
      var li = lines.length - 1, cur = lw[li], add = (lines[li].length ? space : 0) + wd.w;
      if (lines[li].length && cur + add > width) { lines.push([wd]); lw.push(wd.w); }
      else { lines[li].push(wd); lw[li] = cur + add; }
    });
    var lineH = f.size * f.lh;
    return { f: f, lines: lines, widths: lw, space: space, lineH: lineH, h: lines.length * lineH, w: Math.max.apply(null, lw) };
  }

  // largest size (<= role size) at which the longest word of `text` fits `width`
  function fitOver(env, text, role, width, over) {
    var f = fontOf(env, role, over), size = f.size, ctx = env.ctx;
    var words = parse(text, f.upper);
    function widest(sz) {
      var g = fontOf(env, role, merge(over || {}, { size: sz, fixed: true })), m = 0;
      words.forEach(function (wd) { if (wd.br) return; var w = 0; wd.runs.forEach(function (r) { setFont(ctx, g, r.em); w += ctx.measureText(r.t).width; }); m = Math.max(m, w); });
      return m;
    }
    while (size > 18 && widest(size) > width) size -= 1;
    return size === f.size ? (over || null) : merge(over || {}, { size: size, fixed: true });
  }

  function drawText(env, L, x, y, opt) {
    opt = opt || {};
    var ctx = env.ctx, f = L.f, mode = opt.em || 'color', color = opt.color || env.ink;
    var accTxt = env.accentText(f.size), m = mode;
    if ((m === 'color' || m === 'color_underline') && !accTxt) m = env.dark && env.brand.emphasis.dark === 'box' ? 'box' : 'underline';
    L.lines.forEach(function (line, i) {
      var top = y + i * L.lineH, base = top + (L.lineH - f.size) / 2 + f.size * 0.8;
      var lx = x;
      if (opt.align === 'center') lx = x + (opt.width - L.widths[i]) / 2;
      if (opt.align === 'right') lx = x + opt.width - L.widths[i];
      var segs = [], cx = lx;
      line.forEach(function (wd, j) {
        if (j) cx += L.space;
        wd.runs.forEach(function (r, k) { segs.push({ r: r, x: cx, gap: j > 0 && k === 0 }); cx += r.w; });
      });
      var groups = [], g = null;
      segs.forEach(function (sg) {
        if (sg.r.em) { if (!g) { g = { a: sg.x, b: sg.x + sg.r.w }; groups.push(g); } else g.b = sg.x + sg.r.w; }
        else g = null;
      });
      groups.forEach(function (gr) {
        var px = f.size * 0.14;
        if (m === 'box') {
          ctx.save(); ctx.fillStyle = env.accent;
          if (env.dark && env.brand.glow) { ctx.shadowColor = rgba(env.accent, 0.6); ctx.shadowBlur = 28; }
          rr(ctx, gr.a - px, top + (L.lineH - f.size) / 2 - f.size * 0.06, gr.b - gr.a + 2 * px, f.size * 1.1, Math.min(env.r, 12));
          ctx.fill(); ctx.restore();
        } else if (m === 'marker') {
          ctx.fillStyle = rgba(env.accent, env.dark ? 0.55 : 0.32);
          ctx.fillRect(gr.a - px * 0.5, base - f.size * 0.36, gr.b - gr.a + px, f.size * 0.44);
        }
      });
      segs.forEach(function (sg) {
        setFont(ctx, f, sg.r.em || opt.bold);
        var col = color;
        if (sg.r.em) {
          if (m === 'box') col = env.onAccent;
          else if (m === 'color' || m === 'color_underline') col = accTxt;
        }
        ctx.fillStyle = col; ctx.fillText(sg.r.t, sg.x, base);
      });
      if (m === 'underline' || m === 'color_underline') {
        groups.forEach(function (gr) {
          ctx.fillStyle = env.accent;
          ctx.fillRect(gr.a, base + f.size * 0.12, gr.b - gr.a, Math.max(3, f.size * 0.07));
        });
      }
    });
    return L.h;
  }

  /* ---------- blocks: {h, draw(y)} ---------- */
  function textBlock(env, text, role, opt) {
    opt = opt || {};
    var width = opt.width || env.w, L = layoutText(env, text, role, width, opt.font);
    return { h: L.h, kind: role, draw: function (y) { drawText(env, L, opt.x || env.x, y, { em: opt.em, color: opt.color, align: opt.align, width: width, bold: opt.bold }); } };
  }
  function titleEm(env) { return env.brand.emphasis.title; }
  function bodyEm(env) { return env.brand.emphasis.body; }

  function kickerBlock(env, text) {
    if (!text) return null;
    var k = env.brand.kicker, t = (k.prefix || '') + text;
    var col = env.accentText(26) || env.ink;
    var ov = { upper: k.upper !== false };
    if (k.font !== 'mono') { ov.f = 'body'; ov.weight = 700; }
    return textBlock(env, t, 'kicker', { color: col, font: ov });
  }
  function group(blocks, gap) {
    blocks = blocks.filter(Boolean);
    var h = 0; blocks.forEach(function (b, i) { h += b.h + (i ? gap : 0); });
    return { h: h, kind: 'group', draw: function (y) { blocks.forEach(function (b) { b.draw(y); y += b.h + gap; }); } };
  }

  function statementBlock(env, text) {
    var style = env.brand.boxes, pad = style === 'bar' ? 0 : 48, bar = 6, inset = style === 'bar' ? 34 : pad;
    var L = layoutText(env, text, 'statement', env.w - inset - pad);
    var h = L.h + (style === 'bar' ? 0 : pad * 2);
    return {
      h: h, kind: 'statement', draw: function (y) {
        var ctx = env.ctx;
        if (style === 'fill') { ctx.fillStyle = env.panel; rr(ctx, env.x, y, env.w, h, env.r); ctx.fill(); }
        if (style === 'outline') { ctx.strokeStyle = env.accent; ctx.lineWidth = 3; rr(ctx, env.x + 1.5, y + 1.5, env.w - 3, h - 3, env.r); ctx.stroke(); }
        if (style !== 'outline') { ctx.fillStyle = env.accent; ctx.fillRect(env.x, y + (style === 'bar' ? 4 : pad), bar, (style === 'bar' ? L.h - 8 : L.h)); }
        drawText(env, L, env.x + inset, y + (style === 'bar' ? 0 : pad), { em: titleEm(env) });
      }
    };
  }

  function marker(env, i, y, size) {
    var ctx = env.ctx, x = env.x, kind = env.brand.list_marker;
    var f = fontOf(env, 'label', { size: Math.max(26, size * 0.8) });
    if (kind === 'number') {
      setFont(ctx, f, true); ctx.fillStyle = env.accentText(f.size) || env.ink; // never low-contrast text
      ctx.fillText(String(i + 1).padStart(2, '0'), x, y + size * 0.82); return numberMarkerWidth(env, size);
    }
    if (kind === 'circle') {
      var d = size * 1.25; ctx.fillStyle = env.accent; ctx.beginPath(); ctx.arc(x + d / 2, y + size * 0.55, d / 2, 0, Math.PI * 2); ctx.fill();
      setFont(ctx, f, true); ctx.fillStyle = env.onAccent; ctx.textAlign = 'center'; ctx.fillText(String(i + 1), x + d / 2, y + size * 0.55 + f.size * 0.35); ctx.textAlign = 'left';
      return d + 26;
    }
    if (kind === 'square') { ctx.fillStyle = env.accent; ctx.fillRect(x, y + size * 0.3, size * 0.5, size * 0.5); return size * 0.5 + 28; }
    ctx.fillStyle = env.accent; ctx.fillRect(x, y + size * 0.55, 34, 4); return 56;
  }

  // width of the "01" column: measured, so scaled formats (story) and wide label fonts never overlap the title
  function numberMarkerWidth(env, size) {
    var ctx = env.ctx, f = fontOf(env, 'label', { size: Math.max(26, size * 0.8) });
    setFont(ctx, f, true); return Math.max(74, Math.ceil(ctx.measureText('00').width + f.size * 0.9));
  }

  function listBlock(env, items) {
    var probe = fontOf(env, 'item_title'), mw = { number: numberMarkerWidth(env, probe.size), circle: probe.size * 1.25 + 26, square: probe.size * 0.5 + 28, dash: 56 }[env.brand.list_marker] || 74;
    var rows = items.map(function (it) {
      var tw = env.w - mw;
      var t = it.title ? layoutText(env, it.title, 'item_title', tw) : null;
      var d = it.text ? layoutText(env, it.text, 'item_text', tw) : null;
      return { t: t, d: d, h: (t ? t.h : 0) + (t && d ? 8 : 0) + (d ? d.h : 0) };
    });
    var gap = Math.round(34 * env.s), h = 0;
    rows.forEach(function (r, i) { h += r.h + (i ? gap : 0); });
    return {
      h: h, kind: 'list', draw: function (y) {
        rows.forEach(function (r, i) {
          marker(env, i, y, probe.size);
          var yy = y;
          if (r.t) { drawText(env, r.t, env.x + mw, yy, { em: titleEm(env) }); yy += r.t.h + 8; }
          if (r.d) drawText(env, r.d, env.x + mw, yy, { color: env.muted, em: bodyEm(env) });
          y += r.h + gap;
        });
      }
    };
  }

  function compareBlock(env, left, right) {
    var gap = 28, cw = (env.w - gap) / 2, pad = 36;
    function col(c) {
      var lab = layoutText(env, c.label || '', 'label', cw - pad * 2);
      var txt = layoutText(env, c.text || '', 'item_text', cw - pad * 2);
      return { lab: lab, txt: txt, h: lab.h + 18 + txt.h + pad * 2 };
    }
    var A = col(left || {}), B = col(right || {}), h = Math.max(A.h, B.h);
    return {
      h: h, kind: 'compare', draw: function (y) {
        var ctx = env.ctx;
        ctx.save(); ctx.globalAlpha *= 0.62; ctx.setLineDash([10, 8]); ctx.strokeStyle = env.ink; ctx.lineWidth = 2;
        rr(ctx, env.x + 1, y + 1, cw - 2, h - 2, env.r); ctx.stroke(); ctx.setLineDash([]);
        drawText(env, A.lab, env.x + pad, y + pad, { color: env.muted });
        drawText(env, A.txt, env.x + pad, y + pad + A.lab.h + 18, { color: env.muted, em: 'underline' });
        ctx.restore();
        var bx = env.x + cw + gap;
        if (env.dark && env.brand.glow) { ctx.save(); ctx.shadowColor = rgba(env.accent, 0.55); ctx.shadowBlur = 30; }
        ctx.strokeStyle = env.accent; ctx.lineWidth = 4; rr(ctx, bx + 2, y + 2, cw - 4, h - 4, env.r); ctx.stroke();
        if (env.dark && env.brand.glow) ctx.restore();
        drawText(env, B.lab, bx + pad, y + pad, { color: env.accentText(24) || env.ink });
        drawText(env, B.txt, bx + pad, y + pad + B.lab.h + 18, { em: bodyEm(env) });
      }
    };
  }

  function flowBlock(env, nodes, direction) {
    nodes = nodes || [];
    var horiz = direction === 'right' && nodes.length <= 3;
    var pad = 30, arrow = horiz ? 56 : 60, ctx = env.ctx;
    var nw = horiz ? (env.w - arrow * (nodes.length - 1)) / nodes.length : env.w;
    var labW = horiz ? 0 : Math.round(env.w * 0.32);
    if (!horiz) { pad = 26; arrow = 44; }
    var built = nodes.map(function (n, i) {
      var active = n.accent || (n.accent === undefined && i === nodes.length - 1);
      var tw = nw - pad * 2 - (n.label ? labW : 0);
      var lab = n.label ? layoutText(env, n.label, 'label', horiz ? nw - pad * 2 : labW - 20) : null;
      var ov = fitOver(env, n.text || '', 'node', tw);
      var t = layoutText(env, n.text || '', 'node', tw, ov);
      var d = n.detail ? layoutText(env, n.detail, 'node_text', tw) : null;
      var body = t.h + (d ? 10 + d.h : 0);
      var h = horiz ? (lab ? lab.h + 14 : 0) + body + pad * 2 : Math.max(lab ? lab.h : 0, body) + pad * 2;
      return { n: n, active: active, lab: lab, t: t, d: d, h: h };
    });
    var minH = horiz ? Math.round(230 * env.s) : 0;
    var maxH = Math.max.apply(null, built.map(function (b) { return b.h; }).concat([minH]));
    var h = horiz ? maxH : built.reduce(function (a, b, i) { return a + b.h + (i ? arrow : 0); }, 0);
    function node(b, x, y, hh) {
      var fill = b.active ? (b.n.color === 'accent2' ? env.accent2 : env.accent) : null;
      ctx.save();
      if (fill) {
        if (env.dark && env.brand.glow) { ctx.shadowColor = rgba(fill, 0.6); ctx.shadowBlur = 34; }
        ctx.fillStyle = fill; rr(ctx, x, y, nw, hh, env.r); ctx.fill();
      } else { ctx.fillStyle = env.bg; rr(ctx, x, y, nw, hh, env.r); ctx.fill(); ctx.strokeStyle = env.ink; ctx.lineWidth = 2; rr(ctx, x + 1, y + 1, nw - 2, hh - 2, env.r); ctx.stroke(); }
      ctx.restore();
      var tc = fill ? (fill === env.accent ? env.onAccent : onColor(fill, '#FFFFFF', env.brand.colors.ink)) : env.ink;
      var sub = fill ? tc : env.muted;
      var body = b.t.h + (b.d ? 10 + b.d.h : 0), yy = y + hh - pad - body;
      if (!horiz) {
        if (b.lab) drawText(env, b.lab, x + pad, y + (hh - b.lab.h) / 2, { color: sub });
        x += b.lab ? labW : 0; yy = y + (hh - body) / 2;
      } else if (b.lab) drawText(env, b.lab, x + pad, y + pad, { color: sub });
      drawText(env, b.t, x + pad, yy, { color: tc, em: fill ? 'underline' : titleEm(env), bold: true });
      if (b.d) drawText(env, b.d, x + pad, yy + b.t.h + 10, { color: sub });
    }
    function arrowTo(x1, y1, x2, y2) {
      ctx.strokeStyle = env.ink; ctx.fillStyle = env.ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      var a = Math.atan2(y2 - y1, x2 - x1), s = 12;
      ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - s * Math.cos(a - 0.45), y2 - s * Math.sin(a - 0.45));
      ctx.lineTo(x2 - s * Math.cos(a + 0.45), y2 - s * Math.sin(a + 0.45)); ctx.closePath(); ctx.fill();
    }
    return {
      h: h, kind: 'flow', draw: function (y) {
        if (horiz) {
          built.forEach(function (b, i) {
            var x = env.x + i * (nw + arrow); node(b, x, y, maxH);
            if (i < built.length - 1) arrowTo(x + nw + 8, y + maxH / 2, x + nw + arrow - 8, y + maxH / 2);
          });
        } else {
          built.forEach(function (b, i) {
            node(b, env.x, y, b.h);
            if (i < built.length - 1) arrowTo(env.x + 60, y + b.h + 8, env.x + 60, y + b.h + arrow - 8);
            y += b.h + arrow;
          });
        }
      }
    };
  }

  function chipsBlock(env, c) {
    c = c || {};
    var n = Math.max(2, Math.min(c.count || 5, 8)), ctx = env.ctx;
    var chipW = 150, chipH = 64, gap = 18, cols = Math.min(n, 4), rows = Math.ceil(n / cols);
    var gridW = cols * chipW + (cols - 1) * gap;
    var lab = layoutText(env, c.label || '', 'label', gridW);
    var uniqW = env.w - gridW - 60, uniqH = rows * chipH + (rows - 1) * gap;
    var ul = layoutText(env, c.unique_label || '', 'label', uniqW - 40);
    var h = Math.max(uniqH, rows * chipH + (rows - 1) * gap) + 20 + lab.h;
    return {
      h: h, kind: 'chips', draw: function (y) {
        for (var i = 0; i < n; i++) {
          var cx = env.x + (i % cols) * (chipW + gap), cy = y + Math.floor(i / cols) * (chipH + gap);
          ctx.fillStyle = env.neutral; rr(ctx, cx, cy, chipW, chipH, Math.min(env.r, chipH / 2)); ctx.fill();
          ctx.fillStyle = env.bg; ctx.fillRect(cx + 22, cy + chipH / 2 - 3, chipW - 44, 6);
        }
        drawText(env, lab, env.x, y + rows * chipH + (rows - 1) * gap + 20, { color: env.muted });
        var ux = env.x + gridW + 60;
        ctx.save(); if (env.brand.glow) { ctx.shadowColor = rgba(env.accent, 0.65); ctx.shadowBlur = env.dark ? 40 : 24; }
        ctx.fillStyle = env.accent; rr(ctx, ux, y, uniqW, uniqH, Math.min(env.r, 40)); ctx.fill(); ctx.restore();
        drawText(env, ul, ux + 20, y + (uniqH - ul.h) / 2, { color: env.onAccent, align: 'center', width: uniqW - 40 });
      }
    };
  }

  function formulaBlock(env, rows) {
    rows = rows || [];
    var ctx = env.ctx, labW = 260, rowGap = Math.round(26 * env.s);
    var built = rows.map(function (r, i) {
      var last = i === rows.length - 1;
      var lab = layoutText(env, r.label || '', 'label', labW - 20);
      var val = layoutText(env, r.value || '', 'item_title', env.w - labW, last ? null : { weight: 400 });
      return { lab: lab, val: val, last: last, h: Math.max(lab.h, val.h) + 22 };
    });
    var h = built.reduce(function (a, b, i) { return a + b.h + (i ? rowGap : 0); }, 0);
    return {
      h: h, kind: 'formula', draw: function (y) {
        built.forEach(function (b) {
          drawText(env, b.lab, env.x, y + 6, { color: b.last ? (env.accentText(24) || env.ink) : env.muted });
          drawText(env, b.val, env.x + labW, y, { color: b.last ? env.ink : env.muted, em: titleEm(env) });
          ctx.fillStyle = b.last ? env.accent : env.line; ctx.fillRect(env.x + labW, y + b.h - 6, env.w - labW, b.last ? 4 : 2);
          y += b.h + rowGap;
        });
      }
    };
  }

  function codeBlock(env, lines) {
    lines = lines || [];
    var ctx = env.ctx, pad = 40, bar = 58, bg = env.dark ? env.panel : env.brand.colors.dark_bg;
    var codeEnv = Object.assign({}, env); codeEnv.ctx = ctx; codeEnv.bg = bg; codeEnv.dark = true; codeEnv.ink = env.brand.colors.ink_dark;
    codeEnv.accentText = function (size) { return contrast(env.accent, bg) >= 3 ? env.accent : (env.accent2 && contrast(env.accent2, bg) >= 3 ? env.accent2 : '#FFFFFF'); };
    codeEnv.s = env.s; codeEnv.qa = env.qa; codeEnv.brand = env.brand;
    var Ls = lines.map(function (l) { return layoutText(codeEnv, l, 'code', env.w - pad * 2); });
    var h = bar + pad * 2 + Ls.reduce(function (a, L) { return a + L.h; }, 0);
    return {
      h: h, kind: 'code', draw: function (y) {
        ctx.fillStyle = bg; rr(ctx, env.x, y, env.w, h, Math.max(env.r, 12)); ctx.fill();
        ['#FF5F57', '#FEBC2E', '#28C840'].forEach(function (c, i) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(env.x + 34 + i * 30, y + bar / 2 + 4, 9, 0, 7); ctx.fill(); });
        var yy = y + bar + pad - 10;
        Ls.forEach(function (L, i) {
          var isComment = /^\s*(\/\/|#)/.test(lines[i]);
          drawText(codeEnv, L, env.x + pad, yy, { color: isComment ? rgba('#FFFFFF', 0.55) : '#FFFFFF', em: 'color' });
          yy += L.h;
        });
      }
    };
  }

  function bigNumberBlock(env, number, label, role) {
    var ctx = env.ctx, f = fontOf(env, role);
    setFont(ctx, f, true); var nw = ctx.measureText(String(number)).width;
    var lab = label ? layoutText(env, label, 'label', Math.max(160, env.w - nw - 36)) : null;
    var h = f.size * 0.86;
    if (nw > env.w) env.qa.push({ level: 'error', msg: 'Number wider than canvas' });
    return {
      h: h, kind: role, draw: function (y) {
        setFont(ctx, f, true); ctx.fillStyle = env.accentText(f.size) || env.ink; // never low-contrast text
        ctx.fillText(String(number), env.x - f.size * 0.03, y + h * 0.98);
        if (lab) drawText(env, lab, env.x + nw + 32, y + h - lab.h, { color: env.muted });
      }
    };
  }

  function quoteBlock(env, text, author) {
    var ctx = env.ctx, Q = layoutText(env, text, 'quote', env.w - 40);
    var Au = author ? layoutText(env, author, 'label', env.w - 40) : null;
    var h = Q.h + (Au ? 30 + Au.h : 0);
    return {
      h: h, kind: 'quote', draw: function (y) {
        var qf = fontOf(env, 'numeral', { size: 400 });
        setFont(ctx, qf, true); ctx.fillStyle = rgba(env.accent, 0.15); ctx.fillText('“', env.x - 30, y + 250);
        ctx.fillStyle = env.accent; ctx.fillRect(env.x, y + 6, 6, Q.h - 12);
        drawText(env, Q, env.x + 40, y, { em: bodyEm(env) });
        if (Au) drawText(env, Au, env.x + 40, y + Q.h + 30, { color: env.muted });
      }
    };
  }

  function buttonBlock(env, label, url) {
    var ctx = env.ctx, f = fontOf(env, 'button');
    setFont(ctx, f, true); var tw = ctx.measureText(String(label).toUpperCase()).width;
    var bh = Math.round(f.size * 2.6), bw = Math.min(env.w, tw + f.size * 2.4);
    var clean = function (u) { return String(u || '').replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').toLowerCase(); };
    var U = url && !(FMT.mark && clean(url) === clean(env.brand.cta_url)) ? layoutText(env, String(url).replace(/^https?:\/\//, '').replace(/\/$/, ''), 'url', env.w) : null;
    var h = bh + (U ? 26 + U.h : 0);
    return {
      h: h, kind: 'button', draw: function (y) {
        ctx.save();
        if (env.dark && env.brand.glow) { ctx.shadowColor = rgba(env.accent, 0.6); ctx.shadowBlur = 36; }
        ctx.fillStyle = env.accent; rr(ctx, env.x, y, bw, bh, env.brand.shape.pill_cta ? bh / 2 : env.r); ctx.fill(); ctx.restore();
        setFont(ctx, f, true); ctx.fillStyle = env.onAccent; ctx.textAlign = 'center';
        ctx.fillText(String(label).toUpperCase(), env.x + bw / 2, y + bh / 2 + f.size * 0.36); ctx.textAlign = 'left';
        if (U) drawText(env, U, env.x, y + bh + 26, { color: env.muted });
      }
    };
  }

  /* ---------- logo ---------- */
  function logoBlock(env, images, withTagline, sizeOver) {
    var ctx = env.ctx, L = env.brand.logo, img = env.dark ? images.dark : images.light;
    var tf = fontOf(env, 'tagline'), tag = withTagline && L.tagline ? layoutText(env, L.tagline, 'tagline', env.w) : null;
    if (img) {
      var lh = sizeOver ? sizeOver * 1.4 : 64, lw = img.width * lh / img.height;
      return { h: lh + (tag ? 14 + tag.h : 0), kind: 'logo', draw: function (y) { ctx.drawImage(img, env.x, y, lw, lh); if (tag) drawText(env, tag, env.x, y + lh + 14, { color: env.muted }); } };
    }
    if (L.text_fallback === false) return null; // brands whose logo must never be replaced by text
    var wm = L.wordmark;
    if (!wm || !wm.parts) {
      var T = layoutText(env, env.brand.name, 'wordmark', env.w, sizeOver ? { size: sizeOver } : null);
      return { h: T.h + (tag ? 14 + tag.h : 0), kind: 'logo', draw: function (y) { drawText(env, T, env.x, y, { bold: true }); if (tag) drawText(env, tag, env.x, y + T.h + 14, { color: env.muted }); } };
    }
    var f = fontOf(env, 'wordmark', sizeOver ? { size: sizeOver } : (wm.size ? { size: wm.size } : null));
    return {
      h: f.size + (tag ? 16 + tag.h : 0), kind: 'logo', draw: function (y) {
        var x = env.x;
        wm.parts.forEach(function (p) {
          ctx.font = (p.weight || 700) + ' ' + f.size + 'px ' + f.css(false).split('px ')[1];
          if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
          var col = p.color || env.ink;
          if (env.dark && wm.on_dark === 'mono') col = env.ink;
          else if (env.dark && p.dark_color) col = p.dark_color;
          else if (env.dark && contrast(col, env.bg) < 1.6) col = env.ink;
          ctx.fillStyle = col; ctx.fillText(p.text, x, y + f.size * 0.82); x += ctx.measureText(p.text).width;
        });
        if (tag) drawText(env, tag, env.x, y + f.size + 16, { color: env.muted });
      }
    };
  }

  /* ---------- formats ---------- */
  var FORMATS = {
    carousel:    { W: 1080, H: 1350, progress: true,  swipe: true,  mark: false, label: 'carousel' },
    post:        { W: 1080, H: 1350, progress: false, swipe: false, mark: true,  label: 'post 4:5' },
    post_square: { W: 1080, H: 1080, progress: false, swipe: false, mark: true,  label: 'post 1:1' },
    story:       { W: 1080, H: 1920, progress: false, swipe: false, mark: true,  safe_top: 220, safe_bottom: 250, boost: 1.22, label: 'story 9:16' },
    flyer_a5:    { W: 1080, H: 1532, progress: false, swipe: false, mark: true,  print: true, dpr: 1748 / 1080, pt: [419.53, 595.28], boost: 0.9, max_words: 110, label: 'flyer A5' },
    flyer_a4:    { W: 1080, H: 1527, progress: false, swipe: false, mark: true,  print: true, dpr: 2480 / 1080, pt: [595.28, 841.89], boost: 0.85, max_words: 120, label: 'flyer A4' },
    brochure_a4: { W: 1080, H: 1527, progress: false, swipe: false, mark: true,  print: true, dpr: 2480 / 1080, pt: [595.28, 841.89], boost: 0.72, max_words: 170, label: 'brochure A4' },
    video_story: { W: 1080, H: 1920, progress: false, swipe: false, mark: true,  video: true, safe_top: 220, safe_bottom: 340, boost: 1.22, max_words: 40, label: 'video 9:16' },
    video_post:  { W: 1080, H: 1350, progress: false, swipe: false, mark: true,  video: true, max_words: 40, label: 'video 4:5' }
  };
  var FMT = FORMATS.carousel, FMT_NAME = 'carousel';
  function setFormat(name) { FMT_NAME = FORMATS[name] ? name : 'carousel'; FMT = FORMATS[FMT_NAME]; W = FMT.W; H = FMT.H; }
  function geom(brand) {
    var L = brand.layout, top = L.content_top + (FMT.safe_top || 0), sb = FMT.safe_bottom || 0, bottom, py, my = null;
    if (FMT.progress) { bottom = L.content_bottom + (H - 1350); py = L.progress_y + (H - 1350); }
    else { my = H - sb - (FMT.mark_offset || 110); bottom = my - 60; py = my; }
    return { top: top, bottom: bottom, py: py, my: my, min_gap: L.min_gap };
  }

  /* ---------- motion: progressive reveal (static when env.t is null) ---------- */
  function reveal(env, k, fn) {
    if (env.t == null) return fn();
    var M = env.brand.motion, p = Math.max(0, Math.min(1, (env.t - (M.delay + k * M.stagger)) / M.reveal));
    if (p <= 0) return;
    var e = 1 - Math.pow(1 - p, 4), ctx = env.ctx;
    ctx.save(); ctx.globalAlpha *= e; ctx.translate(0, (1 - e) * M.rise); fn(); ctx.restore();
  }

  /* ---------- backgrounds & furniture ---------- */
  function paintBackground(env, slideType) {
    var ctx = env.ctx, b = env.brand, t = b.texture;
    ctx.fillStyle = env.bg; ctx.fillRect(0, 0, W, H);
    var book = slideType === 'cover' || slideType === 'cta';
    var on = t.on === 'all' || (t.on === 'bookends' && book) || (t.on === 'internals' && !book);
    if (!on || t.type === 'none') return;
    ctx.save(); ctx.globalAlpha = t.alpha == null ? 1 : t.alpha;
    var sz = t.size || 60;
    if (t.type === 'grid') {
      ctx.strokeStyle = env.line; ctx.lineWidth = 1;
      for (var x = 0.5; x <= W; x += sz) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (var y = 0.5; y <= H; y += sz) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    } else if (t.type === 'dots') {
      ctx.fillStyle = env.line;
      for (var dx = sz / 2; dx < W; dx += sz) for (var dy = sz / 2; dy < H; dy += sz) { ctx.beginPath(); ctx.arc(dx, dy, t.dot || 2.2, 0, 7); ctx.fill(); }
    } else if (t.type === 'lines') {
      ctx.fillStyle = env.line;
      for (var ly = sz; ly < H; ly += sz) ctx.fillRect(0, ly, W, 1.5);
    }
    ctx.restore();
  }

  function duotone(env, img) {
    var key = [env.bg, env.accent, W, H].join('|');
    img._duo = img._duo || {};
    if (img._duo[key]) return img._duo[key];
    var off = document.createElement('canvas'); off.width = W; off.height = H;
    var o = off.getContext('2d'), sc = Math.max(W / img.width, H / img.height);
    o.drawImage(img, (W - img.width * sc) / 2, (H - img.height * sc) / 2, img.width * sc, img.height * sc);
    try {
      var d = o.getImageData(0, 0, W, H), p = d.data, A = hexRgb(env.bg), B = hexRgb(env.accent);
      for (var i = 0; i < p.length; i += 4) {
        var g = (0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]) / 255 * 0.8;
        p[i] = A[0] + (B[0] - A[0]) * g; p[i + 1] = A[1] + (B[1] - A[1]) * g; p[i + 2] = A[2] + (B[2] - A[2]) * g;
      }
      o.putImageData(d, 0, 0);
    } catch (e) { env.qa.push({ level: 'warn', msg: 'Image duotone skipped (CORS)' }); }
    img._duo[key] = off; return off;
  }
  function paintImage(env, img) {
    if (!img) return;
    var ctx = env.ctx, off = duotone(env, img);
    ctx.save(); ctx.globalAlpha = env.brand.cover.image_opacity; ctx.drawImage(off, 0, 0, W, H); ctx.restore();
    var gr = ctx.createLinearGradient(0, H * 0.45, 0, H); gr.addColorStop(0, rgba(env.bg, 0)); gr.addColorStop(1, rgba(env.bg, 0.85));
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
  }

  function paintFrame(env) {
    var ctx = env.ctx, f = env.brand.frame;
    if (f === 'border') { ctx.strokeStyle = env.line; ctx.lineWidth = 3; rr(ctx, 40, 40, W - 80, H - 80, Math.max(env.r, 0) + 8); ctx.stroke(); }
    if (f === 'corner_ticks') {
      ctx.strokeStyle = env.accent; ctx.lineWidth = 3; var m = 48, l = 36;
      [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m - 40, 1, -1], [W - m, H - m - 40, -1, -1]].forEach(function (c) {
        ctx.beginPath(); ctx.moveTo(c[0] + l * c[2], c[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(c[0], c[1] + l * c[3]); ctx.stroke();
      });
    }
  }

  // brand mark for single formats (post, story, print): small wordmark left, URL right
  function paintMark(env, g, images) {
    var ctx = env.ctx, b = env.brand, lg = logoBlock(env, images, false, 32);
    if (lg) lg.draw(g.my - lg.h / 2);
    if (b.cta_url) {
      var f = fontOf(env, 'url'); setFont(ctx, f, false); ctx.fillStyle = env.muted; ctx.textAlign = 'right';
      ctx.fillText(String(b.cta_url).replace(/^https?:\/\//, '').replace(/\/$/, ''), W - env.x, g.my + f.size * 0.35); ctx.textAlign = 'left';
    }
  }

  function paintFurniture(env, g, i, n, slideType, images) {
    var ctx = env.ctx, b = env.brand, P = b.progress, py = g.py;
    if (FMT.progress && n > 1) {
      if (P.style === 'dots') {
        var gap = 30, total = (n - 1) * gap, sx = P.align === 'center' ? (W - total) / 2 : env.x + 8;
        for (var k = 0; k < n; k++) {
          ctx.fillStyle = k === i ? env.accent : env.neutral; ctx.beginPath();
          ctx.arc(sx + k * gap, py, k === i ? 9 : 6, 0, 7); ctx.fill();
        }
      } else if (P.style === 'bar') {
        ctx.fillStyle = env.neutral; rr(ctx, env.x, py - 3, env.w, 6, 3); ctx.fill();
        ctx.fillStyle = env.accent; rr(ctx, env.x, py - 3, env.w * (i + 1) / n, 6, 3); ctx.fill();
      } else if (P.style === 'fraction') {
        var f = fontOf(env, 'meta'); setFont(ctx, f, true); ctx.fillStyle = env.muted;
        ctx.fillText(String(i + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0'), env.x, py + 8);
      }
      if (slideType === 'cover' && b.swipe_text && FMT.swipe) {
        var mf = fontOf(env, 'meta'); setFont(ctx, mf, true); ctx.fillStyle = env.accentText(22) || env.ink;
        ctx.textAlign = 'right'; ctx.fillText(b.swipe_text, W - env.x, py + 8); ctx.textAlign = 'left';
      }
      if (slideType !== 'cover' && slideType !== 'cta' && b.logo.internal === 'wordmark') {
        var mf2 = fontOf(env, 'meta'); setFont(ctx, mf2, true); ctx.fillStyle = env.muted; ctx.textAlign = 'right';
        ctx.fillText(b.name, W - env.x, py + 8); ctx.textAlign = 'left';
      }
      if (slideType !== 'cover' && slideType !== 'cta' && b.logo.internal === 'icon') {
        var ic = env.dark ? images.icon_dark : images.icon_light;
        if (ic) { ctx.save(); ctx.globalAlpha = 0.75; var s = 64; ctx.drawImage(ic, W - env.x - s, py - s / 2, s, s * ic.height / ic.width); ctx.restore(); }
      }
    }
    if (FMT.mark && slideType !== 'cover' && slideType !== 'cta') paintMark(env, g, images);
    if (b.strip && b.strip.colors && b.strip.colors.length) {
      var sh = b.strip.height || 16, sw = W / b.strip.colors.length, sy = b.strip.position === 'top' ? 0 : H - sh;
      b.strip.colors.forEach(function (c, k) { ctx.fillStyle = c; ctx.fillRect(Math.floor(k * sw), sy, Math.ceil(sw), sh); });
    }
  }

  /* ---------- layouts ---------- */
  function header(env, sp, withTitle) {
    var k = kickerBlock(env, sp.kicker);
    var t = withTitle !== false && sp.title ? textBlock(env, sp.title, 'title', { em: titleEm(env) }) : null;
    var bd = sp.body ? textBlock(env, sp.body, 'body', { color: env.muted, em: bodyEm(env) }) : null;
    var parts = [];
    if (k) parts.push(k);
    var tb = group([t, bd], Math.round(20 * env.s));
    if (tb.h) parts.push(tb);
    return group(parts, Math.round(30 * env.s));
  }
  function note(env, text) { return text ? textBlock(env, text, 'label', { color: env.accentText(24) || env.ink }) : null; }

  var LAYOUTS = {
    statement: function (env, sp) { return { head: header(env, sp), body: [statementBlock(env, sp.statement || ''), note(env, sp.note)] }; },
    numeral: function (env, sp) {
      return { head: kickerBlock(env, sp.kicker), body: [bigNumberBlock(env, sp.number || '01', sp.label, 'numeral'), group([sp.title ? textBlock(env, sp.title, 'title', { em: titleEm(env) }) : null, sp.body ? textBlock(env, sp.body, 'body', { color: env.muted, em: bodyEm(env) }) : null], 20), note(env, sp.note)] };
    },
    list: function (env, sp) { return { head: header(env, sp), body: [listBlock(env, sp.items || []), note(env, sp.note)] }; },
    compare: function (env, sp) { return { head: header(env, sp), body: [compareBlock(env, sp.left, sp.right), note(env, sp.note)] }; },
    flow: function (env, sp) { return { head: header(env, sp), body: [flowBlock(env, sp.nodes, sp.direction), note(env, sp.note)] }; },
    chips: function (env, sp) { return { head: header(env, sp), body: [chipsBlock(env, sp.chips), note(env, sp.note)] }; },
    formula: function (env, sp) { return { head: header(env, sp), body: [formulaBlock(env, sp.rows), note(env, sp.note)] }; },
    code: function (env, sp) { return { head: header(env, sp), body: [codeBlock(env, sp.lines), note(env, sp.note)] }; },
    stat: function (env, sp) {
      return { head: kickerBlock(env, sp.kicker), body: [bigNumberBlock(env, sp.number || '0', sp.label, 'stat'), group([sp.title ? textBlock(env, sp.title, 'title', { em: titleEm(env) }) : null, sp.body ? textBlock(env, sp.body, 'body', { color: env.muted, em: bodyEm(env) }) : null], 20), note(env, sp.source)] };
    },
    quote: function (env, sp) { return { head: kickerBlock(env, sp.kicker), body: [quoteBlock(env, sp.quote || '', sp.author), note(env, sp.note)] }; },
    page: function (env, sp, images) {
      var gap = Math.round(20 * env.s);
      var body = (sp.sections || []).map(function (x) {
        switch (x.type) {
          case 'statement': return statementBlock(env, x.statement || '');
          case 'list': return listBlock(env, x.items || []);
          case 'compare': return compareBlock(env, x.left, x.right);
          case 'flow': return flowBlock(env, x.nodes, x.direction);
          case 'chips': return chipsBlock(env, x.chips);
          case 'formula': return formulaBlock(env, x.rows);
          case 'code': return codeBlock(env, x.lines);
          case 'stat': return group([bigNumberBlock(env, x.number || '0', x.label, 'stat'), x.body ? textBlock(env, x.body, 'body', { color: env.muted, em: bodyEm(env) }) : null], gap);
          case 'quote': return quoteBlock(env, x.quote || '', x.author);
          case 'heading': return textBlock(env, x.title || '', 'title', { em: titleEm(env), font: { size: 54 } });
          case 'text': return textBlock(env, x.body || '', 'body', { color: env.muted, em: bodyEm(env) });
          case 'button': return buttonBlock(env, x.button || '', x.url || env.brand.cta_url);
          case 'note': return note(env, x.note);
          case 'logo': return logoBlock(env, images, true);
        }
        return null;
      });
      return { head: header(env, sp), body: body.concat([note(env, sp.note)]) };
    },
    cta: function (env, sp, images) {
      return {
        head: kickerBlock(env, sp.kicker),
        body: [group([textBlock(env, sp.title || '', 'cta_title', { em: titleEm(env) }), sp.body ? textBlock(env, sp.body, 'body', { color: env.muted, em: bodyEm(env) }) : null], 26),
          sp.button ? buttonBlock(env, sp.button, sp.url || env.brand.cta_url) : null,
          logoBlock(env, images, true)]
      };
    }
  };

  function measure(L) {
    var head = L.head ? L.head.h : 0, body = L.body.filter(Boolean);
    return { head: head, body: body, sum: body.reduce(function (a, b) { return a + b.h; }, 0) };
  }

  // plan once, paint many times (static: t = null; video: t = ms since scene start)
  function planStandard(ctx, brand, sp, i, n, surface, images) {
    var g = geom(brand), top = g.top, bottom = g.bottom, avail = bottom - top;
    var chosen = null, s, qaTmp;
    var maxS = { quote: 1.5, statement: 1.4, numeral: 1.3, stat: 1.3, cta: 1.3, page: 1.15 }[sp.layout] || 1.25;
    if (FMT.print) maxS *= 1.3;
    for (s = maxS; s >= 0.6; s -= 0.025) {
      qaTmp = [];
      var env = makeEnv(ctx, brand, surface, s, qaTmp);
      var L = (LAYOUTS[sp.layout] || LAYOUTS.statement)(env, sp, images), m = measure(L);
      var need = m.head + m.sum + g.min_gap * (m.body.length + (m.head ? 1 : 0));
      var widthErr = qaTmp.some(function (q) { return q.level === 'error'; });
      if (need <= avail && !widthErr) { chosen = { env: env, L: L, m: m }; break; }
    }
    var qa = qaTmp;
    if (!chosen) {
      qa = []; var envMin = makeEnv(ctx, brand, surface, 0.6, qa);
      var Lm = (LAYOUTS[sp.layout] || LAYOUTS.statement)(envMin, sp, images);
      chosen = { env: envMin, L: Lm, m: measure(Lm) };
      qa.push({ level: 'error', msg: 'Content does not fit even at minimum size: cut copy' });
    }
    var env2 = chosen.env, L2 = chosen.L, m2 = chosen.m, headY = top, y = top + (L2.head ? L2.head.h : 0);
    var gap = Math.max(g.min_gap, (bottom - y - m2.sum) / (m2.body.length + 1)), pos = [];
    y += gap;
    m2.body.forEach(function (b) { pos.push(y); if (y + b.h > bottom + 1) qa.push({ level: 'error', msg: 'Block "' + b.kind + '" crosses the bottom safe line' }); y += b.h + gap; });
    if (gap > 150 * H / 1350) qa.push({ level: 'warn', msg: 'Sparse card: gaps ' + Math.round(gap) + 'px. Add a visual block or more copy.' });
    if (env2.s < 0.8) qa.push({ level: 'warn', msg: 'Copy shrunk to ' + Math.round(env2.s * 100) + '%: cut text' });
    return {
      qa: qa, scale: env2.s, blocks: (L2.head ? 1 : 0) + m2.body.length,
      paint: function (t) {
        env2.t = t == null ? null : t;
        paintBackground(env2, sp.layout === 'cta' ? 'cta' : 'internal'); paintFrame(env2);
        if (L2.head) reveal(env2, 0, function () { L2.head.draw(headY); });
        m2.body.forEach(function (b, k) { reveal(env2, k + 1, function () { b.draw(pos[k]); }); });
        paintFurniture(env2, g, i, n, sp.layout, images);
      }
    };
  }

  function planCover(ctx, brand, sp, i, n, surface, images) {
    var qa = [], env = makeEnv(ctx, brand, surface, 1, qa), C = brand.cover, g = geom(brand);
    var k = kickerBlock(env, sp.kicker);
    var setup = sp.setup ? textBlock(env, sp.setup, 'cover_setup', { color: env.ink }) : null;
    var sub = sp.subtitle ? textBlock(env, sp.subtitle, 'cover_sub', { color: env.muted, width: env.w * 0.82, em: bodyEm(env) }) : null;
    var titleF = fontOf(env, 'cover_title');
    var tl = layoutText(env, sp.title || '', 'cover_title', env.w - (C.title_style === 'bands' ? 40 : 0));
    var bandPad = C.title_style === 'bands' ? titleF.size * 0.18 : 0;
    var titleBlock = {
      h: tl.h + (C.title_style === 'bands' ? (tl.lines.length - 1) * 14 + bandPad : 0), draw: function (y) {
        if (C.title_style === 'bands') {
          tl.lines.forEach(function (line, li) {
            var one = { f: tl.f, lines: [line], widths: [tl.widths[li]], space: tl.space, lineH: tl.lineH, h: tl.lineH };
            var yy = y + li * (tl.lineH + 14);
            ctx.save(); if (env.dark && brand.glow) { ctx.shadowColor = rgba(env.accent, 0.55); ctx.shadowBlur = 40; }
            ctx.fillStyle = env.accent; ctx.fillRect(env.x - bandPad, yy, tl.widths[li] + bandPad * 2, tl.lineH); ctx.restore();
            var e2 = Object.assign({}, env); e2.accentText = function () { return env.onAccent; }; e2.bg = env.accent;
            drawText(e2, one, env.x, yy, { color: env.onAccent, em: 'underline', bold: true });
          });
        } else drawText(env, tl, env.x, y, { em: titleEm(env) });
      }
    };
    var logo = C.logo === 'none' ? null : logoBlock(env, images, true);
    var parts = [setup, titleBlock, sub].filter(Boolean), mainH = 0;
    parts.forEach(function (b, j) { mainH += b.h + (j ? 30 : 0); });
    var top = g.top, bottom = g.bottom, logoY = null;
    if (logo && C.logo === 'top') { logoY = top; top += logo.h + 40; }
    var kh = k ? k.h : 0, kY = top;
    var lowLogo = logo && C.logo !== 'top' ? logo.h + 60 : 0;
    if (mainH > bottom - top - kh - 60 - lowLogo) qa.push({ level: 'error', msg: 'Cover text too long' });
    var startY;
    if (C.align === 'bottom') startY = bottom - mainH - lowLogo;
    else if (C.align === 'center') startY = top + kh + (bottom - top - kh - mainH - lowLogo) / 2;
    else startY = top + kh + 70;
    if (logo && C.logo !== 'top') logoY = bottom - logo.h;
    var partY = [], py = startY;
    parts.forEach(function (b) { partY.push(py); py += b.h + 30; });
    if (wordCount(sp.title) > 12) qa.push({ level: 'warn', msg: 'Cover hook over 12 words' });
    return {
      qa: qa, scale: 1, blocks: parts.length + 2,
      paint: function (t) {
        env.t = t == null ? null : t;
        paintBackground(env, 'cover');
        if (images.cover) paintImage(env, images.cover);
        if (env.dark && brand.glow) {
          var gr = ctx.createRadialGradient(W * 0.82, H * 0.62, 10, W * 0.82, H * 0.62, 520);
          gr.addColorStop(0, rgba(env.accent, 0.30)); gr.addColorStop(1, rgba(env.accent, 0));
          ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
        }
        if (C.anchor || sp.anchor) {
          var af = fontOf(env, 'numeral', { size: 560 }); setFont(ctx, af, true);
          ctx.fillStyle = rgba(env.accent, env.dark ? 0.16 : 0.12); ctx.textAlign = 'right';
          ctx.fillText(sp.anchor || C.anchor, W - 60, C.align === 'bottom' ? g.top + 514 : H - 230); ctx.textAlign = 'left';
        }
        paintFrame(env);
        if (logo && C.logo === 'top') reveal(env, 0, function () { logo.draw(logoY); });
        if (k) reveal(env, 0, function () { k.draw(kY); });
        parts.forEach(function (b, j) { reveal(env, j + 1, function () { b.draw(partY[j]); }); });
        if (logo && C.logo !== 'top') reveal(env, parts.length + 1, function () { logo.draw(logoY); });
        paintFurniture(env, g, i, n, 'cover', images);
      }
    };
  }

  function surfaceFor(brand, idx, n, type) {
    var r = brand.rhythm, book = type === 'cover' || type === 'cta';
    if (r === 'all_light') return 'light';
    if (r === 'all_dark') return 'dark';
    if (r === 'bookend_light') return book ? 'light' : 'dark';
    if (r === 'alternate') return book ? 'dark' : (idx % 2 ? 'light' : 'dark');
    return book ? 'dark' : 'light';
  }

  /* ---------- schema: tolerant reading of SLIDES (aliases are reported, never silent) ---------- */
  var FIELDS = {
    common: ['layout', 'surface', 'kicker', 'title', 'body', 'note', 'image', 'duration'],
    cover: ['setup', 'subtitle', 'anchor'], statement: ['statement'], numeral: ['number', 'label'], list: ['items'],
    compare: ['left', 'right'], flow: ['nodes', 'direction'], chips: ['chips'], formula: ['rows'], code: ['lines'],
    stat: ['number', 'label', 'source'], quote: ['quote', 'author'], cta: ['button', 'url'], page: ['sections']
  };
  var ALIAS = { heading: 'title', headline: 'title', hook: 'title', eyebrow: 'kicker', tag: 'kicker', description: 'body', desc: 'body', text: 'body', supporting: 'body', cta: 'button', link: 'url', value: 'number', caption: 'note', takeaway: 'note' };
  var REQUIRED = { statement: 'statement', list: 'items', compare: 'left', flow: 'nodes', chips: 'chips', formula: 'rows', code: 'lines', stat: 'number', quote: 'quote', cta: 'title', cover: 'title', page: 'sections' };
  function asObj(v, key) { return typeof v === 'string' ? (function () { var o = {}; o[key] = v; return o; })() : (v || {}); }
  function normalizeSlide(sp0, qa) {
    var lay = sp0.layout || 'statement', allowed = FIELDS.common.concat(FIELDS[lay] || []), sp = {};
    if (lay === 'cover') allowed = allowed.filter(function (k) { return k !== 'body'; });
    Object.keys(sp0).forEach(function (k) {
      var v = sp0[k], key = k;
      if (allowed.indexOf(k) < 0) {
        if (lay === 'flow' && /^(items|steps|stages)$/.test(k)) key = 'nodes';
        else if (lay === 'list' && /^(nodes|steps|points|bullets)$/.test(k)) key = 'items';
        else if (lay === 'compare' && /^(before|a)$/.test(k)) key = 'left';
        else if (lay === 'compare' && /^(after|b)$/.test(k)) key = 'right';
        else if (lay === 'code' && k === 'code') { key = 'lines'; if (typeof v === 'string') v = v.split('\n'); }
        else if (lay === 'quote' && k === 'text') key = 'quote';
        else if (lay === 'cover' && /^(body|supporting|text)$/.test(k)) key = 'subtitle';
        else if (ALIAS[k]) key = ALIAS[k];
        if (allowed.indexOf(key) < 0) { qa.push({ level: 'warn', msg: 'Unknown field "' + k + '" ignored' }); return; }
        if (sp0[key] != null) { qa.push({ level: 'warn', msg: 'Field "' + k + '" duplicates "' + key + '": ignored' }); return; }
        qa.push({ level: 'warn', msg: 'Field "' + k + '" read as "' + key + '": use "' + key + '"' });
      }
      sp[key] = v;
    });
    if (sp.nodes) sp.nodes = [].concat(sp.nodes).map(function (x) {
      x = asObj(x, 'text');
      if (!x.text && (x.title || x.name)) { x.text = x.title || x.name; }
      else if (x.text && x.title && !x.label) { x.detail = x.detail || x.text; x.text = x.title; }
      return x;
    });
    if (sp.items) sp.items = [].concat(sp.items).map(function (x) {
      x = asObj(x, 'title');
      if (!x.title) x.title = x.label || x.heading || x.name || '';
      if (!x.text) x.text = x.description || x.body || '';
      return x;
    });
    ['left', 'right'].forEach(function (k) { if (sp[k]) { var o = asObj(sp[k], 'text'); if (!o.label && o.title) o.label = o.title; if (!o.text) o.text = o.body || o.description || ''; sp[k] = o; } });
    if (sp.rows) sp.rows = [].concat(sp.rows).map(function (x) { return typeof x === 'string' ? { label: '', value: x } : { label: x.label || x.key || '', value: x.value || x.text || '' }; });
    if (sp.lines && typeof sp.lines === 'string') sp.lines = sp.lines.split('\n');
    var SEC = { statement: 1, list: 1, compare: 1, flow: 1, chips: 1, formula: 1, code: 1, stat: 1, quote: 1, heading: 1, text: 1, button: 1, note: 1, logo: 1 };
    if (sp.sections) sp.sections = [].concat(sp.sections).map(function (x, j) {
      x = x || {}; var t = x.type || x.layout || '';
      if (!SEC[t]) { qa.push({ level: 'error', msg: 'Section ' + (j + 1) + ': unknown type "' + t + '"' }); return {}; }
      if (t === 'heading' || t === 'text' || t === 'button' || t === 'note' || t === 'logo') {
        var o = { type: t }; o.title = x.title || x.text; o.body = x.body || x.text; o.button = x.button || x.label || x.text; o.url = x.url || x.link; o.note = x.note || x.text; return o;
      }
      var q2 = [], src = Object.assign({}, x); delete src.type; src.layout = t;
      var n2 = normalizeSlide(src, q2); n2.type = t;
      q2.forEach(function (q) { qa.push({ level: q.level, msg: 'Section ' + (j + 1) + ' (' + t + '): ' + q.msg }); });
      return n2;
    });
    if (REQUIRED[lay] && !sp[REQUIRED[lay]]) qa.push({ level: 'error', msg: 'Layout "' + lay + '" needs "' + REQUIRED[lay] + '"' });
    if (lay === 'compare' && !sp.right) qa.push({ level: 'error', msg: 'Layout "compare" needs "right"' });
    sp.layout = lay;
    return sp;
  }

  /* ---------- assets ---------- */
  function loadImg(url) {
    return new Promise(function (res) {
      if (!url) return res(null);
      var im = new Image(); im.crossOrigin = 'anonymous';
      var done = false, t = setTimeout(function () { if (!done) { done = true; res(null); } }, 6000);
      im.onload = function () { if (!done) { done = true; clearTimeout(t); res(im); } };
      im.onerror = function () { if (!done) { done = true; clearTimeout(t); res(null); } };
      im.src = url;
    });
  }

  function loadFonts(brand) {
    var fams = {}, F = brand.fonts;
    ['display', 'body', 'mono'].forEach(function (k) {
      var f = F[k]; if (!f || !f.family) return;
      var e = fams[f.family] || (fams[f.family] = { w: {}, files: f.files, google: f.google !== false });
      e.w[f.weight || 400] = 1; if (f.bold) e.w[f.bold] = 1; if (k !== 'mono') e.w[700] = 1;
      if (k === 'body') e.italic = true;
    });
    var jobs = Object.keys(fams).map(function (name) {
      var e = fams[name], ws = Object.keys(e.w).map(Number).sort(function (a, b) { return a - b; });
      if (e.files && e.files.length) {
        return Promise.all(e.files.map(function (fl) {
          var ff = new FontFace(name, 'url(' + fl.url + ')', { weight: String(fl.weight || 400), style: fl.style || 'normal' });
          return ff.load().then(function (x) { document.fonts.add(x); }).catch(function () { });
        }));
      }
      if (!e.google) return Promise.resolve();
      function css(url) {
        return new Promise(function (res) {
          var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = url;
          l.onload = function () { res(true); }; l.onerror = function () { res(false); };
          document.head.appendChild(l);
        });
      }
      var fam = encodeURIComponent(name).replace(/%20/g, '+');
      var axis = e.italic ? 'ital,wght@' + ws.map(function (w) { return '0,' + w; }).concat(ws.map(function (w) { return '1,' + w; })).join(';') : 'wght@' + ws.join(';');
      return css('https://fonts.googleapis.com/css2?family=' + fam + ':' + axis + '&display=block').then(function (ok) {
        return ok ? true : css('https://fonts.googleapis.com/css2?family=' + fam + ':wght@' + ws.join(';') + '&display=block');
      }).then(function (ok) { return ok ? true : css('https://fonts.googleapis.com/css2?family=' + fam + '&display=block'); })
        .then(function () {
          return Promise.all(ws.map(function (w) { return document.fonts.load(w + ' 40px "' + name + '"', 'AaÈà'); }).concat(e.italic ? [document.fonts.load('italic 400 40px "' + name + '"')] : []));
        });
    });
    var timeout = new Promise(function (res) { setTimeout(res, 15000); });
    return Promise.race([Promise.all(jobs), timeout]).then(function () {
      // fonts.check() returns true for unknown families, so test for a loaded FontFace instead
      var loaded = {};
      document.fonts.forEach(function (ff) { if (ff.status === 'loaded') loaded[String(ff.family).replace(/["']/g, '')] = 1; });
      // system fonts (google: false, no files) are not downloaded: never report them as missing
      return Object.keys(fams).filter(function (n) { return !loaded[n] && (fams[n].google || (fams[n].files && fams[n].files.length)); });
    });
  }


  /* ---------- copy lint (deterministic: dashes, "not X but Y", banned words) ---------- */
  function norm(t) { return String(t || '').replace(/\*/g, '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function slideTexts(sp) {
    var out = [];
    ['kicker', 'setup', 'title', 'subtitle', 'body', 'statement', 'note', 'quote', 'button', 'label', 'source'].forEach(function (k) { if (sp[k]) out.push(String(sp[k])); });
    (sp.items || []).forEach(function (x) { out.push(String(x.title || '')); out.push(String(x.text || '')); });
    (sp.nodes || []).forEach(function (x) { out.push(String(x.text || '')); out.push(String(x.detail || '')); });
    ['left', 'right'].forEach(function (k) { if (sp[k]) out.push(String(sp[k].text || '')); });
    (sp.rows || []).forEach(function (x) { out.push(String(x.value || '')); });
    (sp.sections || []).forEach(function (x) { out = out.concat(slideTexts(x)); });
    return out.filter(Boolean);
  }
  var NOT_BUT = [
    /\bnon solo\b[^.!?]*\bma\b/i, /\bnon\b[^.!?]{1,80},\s*ma\b/i,
    /,\s*non\s+(di|del|della|dei|delle|da|dal|con|per|un|una|il|la|lo|le|i|gli|solo|piu|in)\b/i,
    /\bnot (just|only|merely)\b[^.!?]*\bbut\b/i, /\bnot\b[^.!?]{1,80},\s*but\b/i,
    /,\s*not\s+(a|an|the|just|only|by|with|for|in|of)\b/i,
    /\bno solo\b[^.!?]*\bsino\b/i, /\bno\b[^.!?]{1,80},?\s*sino\b/i,
    /,\s*no\s+(de|del|con|por|un|una|el|la|los|las|en)\b/i
  ];
  function lintText(t, banned, qa) {
    var raw = String(t).replace(/\*/g, ''), n = norm(t);
    if (/[\u2014\u2013]/.test(raw)) qa.push({ level: 'error', msg: 'Dash in copy: "' + raw.slice(0, 40) + '"' });
    NOT_BUT.forEach(function (re) { var m = n.match(re); if (m) qa.push({ level: 'error', msg: '"Not X, but Y": "' + m[0].slice(0, 50) + '"' }); });
    // sentence pair: "Non vuol dire X. Vuol dire Y" / "It isn't X. It's Y" (same verb restated)
    var sent = n.split(/(?<=[.!?])\s+/);
    for (var i = 0; i + 1 < sent.length; i++) {
      var m2 = sent[i].match(/\b(?:non|not|no|isn'?t|aren'?t|doesn'?t|don'?t)\s+((?:si\s+)?[a-z']+(?:\s+[a-z']+)?)/);
      if (!m2) continue;
      var verb = m2[1].split(' ')[0] === 'si' ? m2[1] : m2[1].split(' ')[0];
      if (verb.length > 1 && sent[i + 1].indexOf(verb) === 0) qa.push({ level: 'error', msg: '"Not X, but Y" across sentences: "' + sent[i].slice(0, 30) + '… ' + sent[i + 1].slice(0, 25) + '"' });
    }
    // short negation followed by a short correction: "Non semplice o leggibile. Deciso." / "Not a tool. A system."
    for (var j = 0; j + 1 < sent.length; j++) {
      var a = sent[j].split(/\s+/).filter(Boolean), b2 = sent[j + 1].split(/\s+/).filter(Boolean);
      if (/^(non|not|no|ni)$/.test(a[0] || '') && a.length <= 6 && b2.length <= 4) qa.push({ level: 'error', msg: '"Not X. Y" correction: "' + sent[j].slice(0, 30) + ' ' + sent[j + 1].slice(0, 20) + '"' });
    }
    lintDates(n, qa);
    var ph = raw.match(/\{\{[^}]*\}\}|\[[A-Z ]{3,}\]|\bTBD\b|\bXXX\b|lorem ipsum/i);
    if (ph) qa.push({ level: 'error', msg: 'Placeholder to fill: "' + ph[0] + '"' });
    (banned || []).forEach(function (w) {
      var b = norm(w).trim(); if (!b) return;
      var stem = b.length > 5 && b.indexOf(' ') < 0 ? b.slice(0, -1) : b;
      var re = new RegExp('(^|[^a-z0-9])' + stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + (stem === b ? '' : '[a-z]?') + '([^a-z0-9]|$)');
      if (re.test(n)) qa.push({ level: 'error', msg: 'Banned word: "' + w + '"' });
    });
  }

  // weekday + date must match the calendar (nearest occurrence from today)
  var WD = { it: ['domenica', 'lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato'], en: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'], es: ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'] };
  var MO = { it: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'], en: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'], es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'] };
  function lintDates(n, qa) {
    Object.keys(WD).forEach(function (L) {
      var wd = WD[L].join('|'), mo = MO[L].join('|');
      var res = [new RegExp('\\b(' + wd + '),?\\s+(\\d{1,2})(?:\\s+de)?\\s+(' + mo + ')(?:\\s+(\\d{4}))?', 'g'), new RegExp('\\b(' + wd + '),?\\s+(' + mo + ')\\s+(\\d{1,2})(?:,?\\s+(\\d{4}))?', 'g')];
      res.forEach(function (re, k) {
        var m;
        while ((m = re.exec(n))) {
          var wi = WD[L].indexOf(m[1]), day = +(k ? m[3] : m[2]), mi = MO[L].indexOf(k ? m[2] : m[3]), yr = m[4] ? +m[4] : null;
          var now = new Date(), y = yr || now.getFullYear(), d = new Date(y, mi, day);
          if (!yr && d < new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)) { y++; d = new Date(y, mi, day); }
          if (d.getDate() !== day) { qa.push({ level: 'error', msg: 'Date check: "' + m[0] + '" does not exist' }); continue; }
          if (d.getDay() !== wi) qa.push({ level: 'error', msg: 'Date check: ' + day + ' ' + MO[L][mi] + ' ' + y + ' is ' + WD[L][d.getDay()] + ', not ' + m[1] });
        }
      });
    });
  }
  function lintSlide(sp, brand, lang, qa) {
    var bw = brand.banned_words || {}, list = [].concat(bw.all || [], bw[lang] || []);
    slideTexts(sp).forEach(function (t) { lintText(t, list, qa); });
  }

  /* ---------- print export: PNG 300 dpi (pHYs) and a minimal PDF writer (JPEG pages) ---------- */
  var CRC = (function () { var t = [], c, n, k; for (n = 0; n < 256; n++) { c = n; for (k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(u8) { var c = 0xFFFFFFFF; for (var i = 0; i < u8.length; i++) c = CRC[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function blobOf(canvas, type, q) { return new Promise(function (res) { canvas.toBlob(res, type, q); }); }
  function bytesOf(blob) { return blob.arrayBuffer().then(function (b) { return new Uint8Array(b); }); }
  function pngWithDpi(u8, dpi) {
    var ppm = Math.round(dpi / 0.0254), chunk = new Uint8Array(21), dv = new DataView(chunk.buffer);
    dv.setUint32(0, 9); chunk.set([112, 72, 89, 115], 4); dv.setUint32(8, ppm); dv.setUint32(12, ppm); chunk[16] = 1;
    dv.setUint32(17, crc32(chunk.subarray(4, 17)));
    var out = new Uint8Array(u8.length + 21); out.set(u8.subarray(0, 33)); out.set(chunk, 33); out.set(u8.subarray(33), 54);
    return out;
  }
  function makePDF(pages, ptW, ptH) {
    var parts = [], off = 0, xref = [], enc = function (str) { var u = new Uint8Array(str.length); for (var i = 0; i < str.length; i++) u[i] = str.charCodeAt(i) & 255; return u; };
    function put(x) { var u = typeof x === 'string' ? enc(x) : x; parts.push(u); off += u.length; }
    function obj(id, body, stream) { xref[id] = off; put(id + ' 0 obj\n' + body + '\n'); if (stream) { put('stream\n'); put(stream); put('\nendstream\n'); } put('endobj\n'); }
    put('%PDF-1.4\n%âãÏÓ\n');
    var n = pages.length, kids = [];
    for (var i = 0; i < n; i++) kids.push((3 + i * 3) + ' 0 R');
    obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
    obj(2, '<< /Type /Pages /Kids [' + kids.join(' ') + '] /Count ' + n + ' >>');
    pages.forEach(function (pg, i) {
      var pid = 3 + i * 3, iid = pid + 1, cid = pid + 2, w = ptW.toFixed(2), h = ptH.toFixed(2);
      var content = 'q ' + w + ' 0 0 ' + h + ' 0 0 cm /Im0 Do Q';
      obj(pid, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + w + ' ' + h + '] /Resources << /XObject << /Im0 ' + iid + ' 0 R >> >> /Contents ' + cid + ' 0 R >>');
      obj(iid, '<< /Type /XObject /Subtype /Image /Width ' + pg.w + ' /Height ' + pg.h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + pg.jpg.length + ' >>', pg.jpg);
      obj(cid, '<< /Length ' + content.length + ' >>', enc(content));
    });
    var xo = off, last = 2 + n * 3, x = 'xref\n0 ' + (last + 1) + '\n0000000000 65535 f \n';
    for (var k = 1; k <= last; k++) x += String(xref[k]).padStart(10, '0') + ' 00000 n \n';
    put(x + 'trailer\n<< /Size ' + (last + 1) + ' /Root 1 0 R >>\nstartxref\n' + xo + '\n%%EOF\n');
    return new Blob(parts, { type: 'application/pdf' });
  }

  /* ---------- UI ---------- */
  function saveBlob(blob, name) {
    return new Promise(function (res) {
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); res(); }, 400);
    });
  }
  function download(canvas, name) { return new Promise(function (res) { canvas.toBlob(function (b) { saveBlob(b, name).then(res); }, 'image/png'); }); }

  function css() {
    if (document.getElementById('yoca-css')) return;
    var st = document.createElement('style'); st.id = 'yoca-css';
    st.textContent = '.yoca-wrap{font:14px/1.4 system-ui,sans-serif;color:#222;background:#EEE;padding:16px;min-height:100vh;box-sizing:border-box}' +
      '.yoca-bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:16px}.yoca-bar b{font-size:15px}' +
      '.yoca-btn{border:0;background:#222;color:#fff;padding:10px 16px;border-radius:8px;cursor:pointer;font-weight:600}.yoca-btn.alt{background:#8a1c1c}' +
      '.yoca-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}' +
      '.yoca-card{background:#fff;border-radius:10px;padding:10px;box-shadow:0 1px 3px rgba(0,0,0,.1)}' +
      '.yoca-card canvas{width:100%;height:auto;display:block;border-radius:4px}' +
      '.yoca-qa{font-size:12px;margin:8px 0;padding:6px 8px;border-radius:6px;background:#EAF7EA;color:#245c24}' +
      '.yoca-qa.warn{background:#FFF5DB;color:#7a5600}.yoca-qa.error{background:#FDE7E7;color:#8a1c1c}' +
      '.yoca-row{display:flex;justify-content:space-between;align-items:center;gap:8px}.yoca-row .yoca-btn{padding:6px 10px;font-size:12px}' +
      '.yoca-video{margin-bottom:16px}.yoca-player{width:min(100%,420px);height:auto;display:block;border-radius:6px;margin-bottom:10px;background:#000}' +
      '.yoca-report{margin-top:16px}.yoca-report textarea{width:100%;min-height:160px;font:12px/1.4 monospace;box-sizing:border-box}';
    document.head.appendChild(st);
  }

  /* ---------- main ---------- */
  function render(cfg) {
    var brand = merge(DEFAULT_BRAND, cfg.brand || {});
    var opt = cfg.options || {}, ui = UI[opt.lang] || UI.it, lang = opt.lang || 'it';
    var fmtWarn = opt.format && !FORMATS[opt.format] ? opt.format : null;
    setFormat(opt.format || 'carousel');
    var raw = cfg.slides || [];
    var mount = typeof opt.mount === 'string' ? document.querySelector(opt.mount) : (opt.mount || document.getElementById('yoca') || document.body);
    css();
    mount.innerHTML = '<div class="yoca-wrap"><div class="yoca-bar"><b></b><button class="yoca-btn yoca-all" disabled></button><button class="yoca-btn alt yoca-rep" hidden></button><span class="yoca-st"></span></div>' +
      '<div class="yoca-grid"></div><details class="yoca-report" hidden><summary></summary><textarea readonly></textarea></details></div>';
    mount.querySelector('b').textContent = brand.name + ' \u00B7 ' + FMT.label + ' \u00B7 ' + raw.length + ' \u00D7 ' + Math.round(W * (FMT.dpr || 1)) + '\u00D7' + Math.round(H * (FMT.dpr || 1)) + (FMT.print ? ' (300 dpi)' : '');
    var grid = mount.querySelector('.yoca-grid'), allBtn = mount.querySelector('.yoca-all'), repBtn = mount.querySelector('.yoca-rep'), st = mount.querySelector('.yoca-st');
    var det = mount.querySelector('.yoca-report'), ta = det.querySelector('textarea');
    allBtn.textContent = ui.loading;
    var base = slug(opt.file || brand.name), L = brand.logo;
    var norm0 = raw.map(function (r) { var q = []; return { sp: normalizeSlide(r || {}, q), qa: q }; });
    return Promise.all([loadFonts(brand), loadImg(L.url_light), loadImg(L.url_dark), loadImg(L.icon_light), loadImg(L.icon_dark),
      loadImg((norm0[0] || { sp: {} }).sp.image)]).then(function (r) {
      var missing = r[0], images = { light: r[1], dark: r[2], icon_light: r[3], icon_dark: r[4], cover: r[5] };
      var results = [], canvases = [], plans = [], makers = [], planners = [], n = norm0.length;
      norm0.forEach(function (it, i) {
        var sp = it.sp;
        var type = sp.layout === 'cover' ? 'cover' : sp.layout;
        var surface = sp.surface || surfaceFor(brand, i, n, type);
        var planOn = function (x) { return type === 'cover' ? planCover(x, brand, sp, i, n, surface, images) : planStandard(x, brand, sp, i, n, surface, images); };
        var make = function (dpr) {
          var c = document.createElement('canvas'); c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
          var x = c.getContext('2d'); x.scale(dpr, dpr); x.textBaseline = 'alphabetic';
          var pl = planOn(x); pl.paint(null); return { cv: c, plan: pl };
        };
        makers.push(make); planners.push({ planOn: planOn, sp: sp, surface: surface });
        var qa = it.qa.slice(), plan = null, cv = document.createElement('canvas');
        try { var mk = make(1); cv = mk.cv; plan = mk.plan; qa = qa.concat(plan.qa); }
        catch (e) { cv.width = W; cv.height = H; qa.push({ level: 'error', msg: 'Render error: ' + e.message }); }
        if (!LAYOUTS[type] && type !== 'cover') qa.push({ level: 'error', msg: 'Unknown layout "' + type + '": rendered as statement' });
        if (i > 0 && norm0[i - 1].sp.layout === sp.layout && type !== 'cover' && type !== 'cta' && type !== 'page') qa.push({ level: 'error', msg: 'Same layout as previous card: pick another layout' });
        lintSlide(sp, brand, lang, qa);
        if (type === 'cta' && sp.button && norm(sp.button).replace(/^https?:\/\//, '').replace(/^www\./, '') === norm(sp.url || brand.cta_url).replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')) qa.push({ level: 'error', msg: 'CTA button repeats the URL: write the action (e.g. "Fai il test")' });
        var words = wordCount([sp.title, sp.body, sp.statement, sp.quote, (sp.items || []).map(function (x) { return x.title + ' ' + (x.text || ''); }).join(' ')].join(' '));
        if (words > (FMT.max_words || 70)) qa.push({ level: 'warn', msg: words + ' words: over ' + (FMT.max_words || 70) + ' per card' });
        if (missing.length) qa.push({ level: 'warn', msg: ui.fonts + ' (' + missing.join(', ') + ')' });
        if (i === 0 && (L.url_light || L.url_dark || L.text_fallback === false) && !images.light && !images.dark) qa.push({ level: 'warn', msg: ui.logo });
        if (fmtWarn && i === 0) qa.push({ level: 'error', msg: 'Unknown format "' + fmtWarn + '": rendered as carousel' });
        results.push({ index: i + 1, layout: type, surface: surface, scale: plan ? plan.scale : 0, qa: qa });
        canvases.push(cv); plans.push(plan);
        var card = document.createElement('div'); card.className = 'yoca-card';
        var lvl = qa.some(function (q) { return q.level === 'error'; }) ? 'error' : (qa.length ? 'warn' : '');
        var name = (n === 1 ? base : base + '_' + String(i + 1).padStart(2, '0')) + '.png';
        card.appendChild(cv);
        var qd = document.createElement('div'); qd.className = 'yoca-qa ' + lvl;
        qd.textContent = qa.length ? qa.map(function (q) { return (q.level === 'error' ? '✖ ' : '⚠ ') + q.msg; }).join(' | ') : '✔ ' + ui.ok;
        var row = document.createElement('div'); row.className = 'yoca-row';
        var lab = document.createElement('span'); lab.textContent = String(i + 1).padStart(2, '0') + ' · ' + type + ' · ' + surface;
        var b1 = document.createElement('button'); b1.className = 'yoca-btn'; b1.textContent = FMT.print ? ui.png300 : ui.one;
        b1.onclick = function () { FMT.print ? savePrintPNG(i, name) : download(cv, name); };
        row.appendChild(lab); row.appendChild(b1); card.appendChild(qd); card.appendChild(row); grid.appendChild(card);
      });
      function fileName(i, ext) { return (n === 1 ? base : base + '_' + String(i + 1).padStart(2, '0')) + '.' + ext; }
      function savePrintPNG(i, name) {
        var big = makers[i](FMT.dpr).cv;
        return blobOf(big, 'image/png').then(bytesOf).then(function (u8) { return saveBlob(new Blob([pngWithDpi(u8, 300)], { type: 'image/png' }), name); });
      }
      function buildPDF() {
        var pages = [], p = Promise.resolve();
        makers.forEach(function (mk) {
          p = p.then(function () { var big = mk(FMT.dpr).cv; return blobOf(big, 'image/jpeg', 0.92).then(bytesOf).then(function (u8) { pages.push({ jpg: u8, w: big.width, h: big.height }); big.width = 1; }); });
        });
        return p.then(function () { return makePDF(pages, FMT.pt[0], FMT.pt[1]); });
      }
      G.YOCA_PDF = buildPDF;
      allBtn.disabled = false;
      if (FMT.print) {
        allBtn.textContent = ui.pdf;
        allBtn.onclick = function () { allBtn.disabled = true; allBtn.textContent = ui.working; buildPDF().then(function (b) { return saveBlob(b, base + '.pdf'); }).then(function () { allBtn.disabled = false; allBtn.textContent = ui.pdf; }); };
        var pngAll = document.createElement('button'); pngAll.className = 'yoca-btn'; pngAll.textContent = ui.png300;
        pngAll.onclick = function () { var p = Promise.resolve(); makers.forEach(function (m, i) { p = p.then(function () { return savePrintPNG(i, fileName(i, 'png')); }); }); };
        allBtn.parentNode.insertBefore(pngAll, allBtn.nextSibling);
      } else {
        allBtn.textContent = n === 1 ? ui.one : ui.all;
        allBtn.onclick = function () {
          var p = Promise.resolve();
          canvases.forEach(function (cv, i) { p = p.then(function () { return download(cv, fileName(i, 'png')); }); });
        };
      }
      if (FMT.video) buildVideo();
      function buildVideo() {
        var M = brand.motion, pc = document.createElement('canvas'); pc.width = W; pc.height = H; pc.className = 'yoca-player';
        var px = pc.getContext('2d'); px.textBaseline = 'alphabetic';
        var vplans = planners.map(function (q) { try { return q.planOn(px); } catch (e) { return null; } });
        var durs = planners.map(function (q, k) {
          if (q.sp.duration) return q.sp.duration * 1000;
          var w = wordCount(slideTexts(q.sp).join(' ')), bl = vplans[k] ? vplans[k].blocks : 3;
          return Math.max(3000, Math.min(9000, 1400 + bl * M.stagger + M.reveal + w * 280));
        });
        var total = durs.reduce(function (a, b) { return a + b; }, 0);
        var bgOf = function (q) { return q.surface === 'dark' ? brand.colors.dark_bg : brand.colors.light_bg; };
        function frame(ms) {
          var acc = 0, k = 0;
          while (k < durs.length - 1 && ms >= acc + durs[k]) { acc += durs[k]; k++; }
          var t = ms - acc, pl = vplans[k];
          if (pl) pl.paint(t);
          var left = durs[k] - t;
          if (k < durs.length - 1 && left < M.fade) {
            px.save(); px.globalAlpha = 1 - left / M.fade; px.fillStyle = bgOf(planners[k + 1]); px.fillRect(0, 0, W, H); px.restore();
            var sb = brand.strip;   // the brand strip never fades: static overlay on every frame
            if (sb && sb.colors && sb.colors.length) { var sh = sb.height || 16, sw = W / sb.colors.length, sy = sb.position === 'top' ? 0 : H - sh; sb.colors.forEach(function (c, j) { px.fillStyle = c; px.fillRect(Math.floor(j * sw), sy, Math.ceil(sw), sh); }); }
          }
        }
        frame(total);
        var box = document.createElement('div'); box.className = 'yoca-video';
        var play = document.createElement('button'); play.className = 'yoca-btn'; play.textContent = ui.play;
        var rec = document.createElement('button'); rec.className = 'yoca-btn'; rec.textContent = ui.video;
        var info = document.createElement('span'); info.textContent = (total / 1000).toFixed(1) + ' s · ' + n + ' scene';
        var vbar = document.createElement('div'); vbar.className = 'yoca-bar'; vbar.appendChild(play); vbar.appendChild(rec); vbar.appendChild(info);
        box.appendChild(pc); box.appendChild(vbar); grid.parentNode.insertBefore(box, grid);
        var raf = null;
        function run(onEnd) {
          var t0 = performance.now(); cancelAnimationFrame(raf);
          (function step() { var ms = performance.now() - t0; frame(Math.min(ms, total)); if (ms < total) raf = requestAnimationFrame(step); else if (onEnd) onEnd(); })();
        }
        play.onclick = function () { run(); };
        rec.onclick = function () {
          var types = ['video/mp4;codecs=avc1.42E01E', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
          var mime = types.filter(function (m) { return window.MediaRecorder && MediaRecorder.isTypeSupported(m); })[0];
          if (!mime || !pc.captureStream) { info.textContent = ui.novideo; return; }
          var chunks = [], mr = new MediaRecorder(pc.captureStream(30), { mimeType: mime, videoBitsPerSecond: 8000000 });
          mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
          mr.onstop = function () {
            var ext = /mp4/.test(mime) ? 'mp4' : 'webm';
            saveBlob(new Blob(chunks, { type: mime.split(';')[0] }), base + '.' + ext);
            rec.disabled = false; rec.textContent = ui.video; info.textContent = (total / 1000).toFixed(1) + ' s · ' + ext.toUpperCase();
            G.YOCA_VIDEO.last = { mime: mime, bytes: chunks.reduce(function (a, c) { return a + c.size; }, 0) };
          };
          rec.disabled = true; rec.textContent = ui.recording; mr.start(250);
          run(function () { setTimeout(function () { mr.stop(); }, 300); });
        };
        G.YOCA_VIDEO = { frame: frame, total: total, durations: durs, canvas: pc, record: rec.onclick };
      }
      var errs = 0, warns = 0, lines = ['yOCA QA · ' + FMT_NAME + ' · ' + n + ' card'];
      results.forEach(function (rs) {
        errs += rs.qa.filter(function (q) { return q.level === 'error'; }).length; warns += rs.qa.filter(function (q) { return q.level !== 'error'; }).length;
        if (rs.qa.length) lines.push('Card ' + String(rs.index).padStart(2, '0') + ' · ' + rs.layout + ': ' + rs.qa.map(function (q) { return (q.level === 'error' ? '✖ ' : '⚠ ') + q.msg; }).join('; '));
      });
      lines.push(ui.fix);
      var report = lines.join('\n');
      st.textContent = errs ? ('✖ ' + errs + ' QA error(s)') : '✔ ' + ui.ok;
      if (errs || warns) {
        repBtn.hidden = false; repBtn.textContent = ui.report; det.hidden = false; det.querySelector('summary').textContent = ui.report; ta.value = report;
        if (errs) det.open = true;
        repBtn.onclick = function () {
          var done = function () { repBtn.textContent = ui.copied; };
          var fail = function () { det.open = true; ta.focus(); ta.select(); try { document.execCommand('copy'); done(); } catch (e) { } };
          try { navigator.clipboard.writeText(report).then(done, fail); } catch (e) { fail(); }
        };
      }
      G.YOCA_RESULT = { format: FMT_NAME, brand: brand.name, slides: results, canvases: canvases, plans: plans, fonts_missing: missing, report: report };
      return G.YOCA_RESULT;
    });
  }

  G.YOCA = { version: '2.2.3', formats: Object.keys(FORMATS), lint: lintText, render: render, contrast: contrast };
})(typeof window !== 'undefined' ? window : this);
