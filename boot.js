// 入口：① このブラウザで動くか（パソコンの Chrome・Edge）→ ② 合言葉（公開版だけ）→ ③ 本体を読み込む
// 公開版では、本体（app/）は合言葉で暗号にしてあり、合言葉から作った鍵で、このブラウザの中で戻してから使う（sw.js）。
const app = document.getElementById('app');
const ICON = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="6" width="52" height="52" rx="12" fill="#5b8cff"/><circle cx="32" cy="28" r="11" fill="white"/><rect x="22" y="42" width="20" height="9" rx="4" fill="white"/></svg>';
const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (k === 'html') e.innerHTML = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v); }
  for (const c of kids.flat()) if (c != null) e.append(c);
  return e;
};
const page = (...kids) => app.replaceChildren(el('div', { class: 'gate' }, el('h1', { html: ICON + '<span>アーカイブ顔チェック</span>' }), ...kids));

// ---------- ① ブラウザ ----------
function check() {
  const ua = navigator.userAgent;
  const brands = (navigator.userAgentData && navigator.userAgentData.brands) || [];
  const chromium = brands.some((b) => /Chromium|Google Chrome|Microsoft Edge/.test(b.brand));
  const mobile = (navigator.userAgentData && navigator.userAgentData.mobile) || /iPhone|iPad|Android|Mobile/.test(ua);
  const apis = typeof VideoEncoder === 'function' && typeof VideoDecoder === 'function' && typeof OffscreenCanvas === 'function' && typeof window.showSaveFilePicker === 'function';
  if (mobile) return 'mobile';
  if (!chromium || !apis) return /AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg/.test(ua) ? 'safari' : /Firefox/.test(ua) ? 'firefox' : 'other';
  return 'ok';
}
function unsupported(kind) {
  const url = location.href.split('#')[0];
  const copyBtn = el('button', { onclick: async () => { try { await navigator.clipboard.writeText(url); copyBtn.textContent = 'コピーしました'; } catch { copyBtn.textContent = 'コピーできませんでした（URL を選んでコピーしてください）'; } } }, 'このページの URL をコピー');
  const why = {
    safari: 'いまは Safari で開いています。このページは、動画を読み書きする仕組みの都合で、パソコンの Google Chrome と Microsoft Edge だけに対応しています。',
    firefox: 'いまは Firefox で開いています。このページは、動画を読み書きする仕組みの都合で、パソコンの Google Chrome と Microsoft Edge だけに対応しています。',
    mobile: 'スマートフォン・タブレットでは使えません（動画の処理が重いため）。パソコンの Google Chrome か Microsoft Edge で開いてください。',
    other: 'このブラウザ（または、この版）では動きません。パソコンの Google Chrome か Microsoft Edge の新しい版で開いてください。',
  }[kind];
  page(
    el('p', {}, why),
    kind === 'mobile' ? null : el('div', { class: 'card' },
      el('b', {}, '開き方'),
      el('ol', {},
        el('li', {}, 'Google Chrome（または Microsoft Edge）を開きます。入っていないときは、無料で入れられます：', el('a', { href: 'https://www.google.com/chrome/', target: '_blank', rel: 'noopener' }, 'Chrome'), '／', el('a', { href: 'https://www.microsoft.com/edge', target: '_blank', rel: 'noopener' }, 'Edge')),
        el('li', {}, '下のボタンで、このページの URL をコピーして、Chrome（Edge）のアドレス欄に貼り付けて開きます。'),
      ),
      el('div', {}, el('code', {}, url)),
      copyBtn,
    ),
    el('p', { class: 'muted' }, '動画は、開いたパソコンのブラウザの中だけで処理されます（どこにも送られません）。'),
  );
}

// ---------- ② 合言葉（公開版だけ） ----------
const LOCK = window.FC_LOCK || null;
const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
function idb(mode, fn) {
  return new Promise((resolve, reject) => {
    const rq = indexedDB.open('fc-lock', 1);
    rq.onupgradeneeded = () => rq.result.createObjectStore('k');
    rq.onerror = () => reject(rq.error);
    rq.onsuccess = () => { const t = rq.result.transaction('k', mode); const r = fn(t.objectStore('k')); t.oncomplete = () => resolve(r && r.result); t.onerror = () => reject(t.error); };
  });
}
async function tryKey(raw) {
  try {
    const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
    const c = b64(LOCK.check);
    const plain = new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: c.slice(0, 12) }, key, c.slice(12)));
    return plain === 'face-check-ok';
  } catch { return false; }
}
async function derive(pass) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass.normalize('NFKC').trim()), 'PBKDF2', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: b64(LOCK.salt), iterations: LOCK.iter }, base, 256));
}
async function swReady() {
  if (!('serviceWorker' in navigator)) throw new Error('このブラウザでは、合言葉つきのページを開けません');
  await navigator.serviceWorker.register('sw.js', { scope: './' });
  await navigator.serviceWorker.ready;
  if (!navigator.serviceWorker.controller) {
    await new Promise((resolve) => { navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }); setTimeout(resolve, 3000); });
  }
  if (!navigator.serviceWorker.controller) { location.reload(); throw new Error('reload'); }
}
function giveKey(raw) {
  return new Promise((resolve) => {
    const ch = new MessageChannel();
    ch.port1.onmessage = () => resolve();
    navigator.serviceWorker.controller.postMessage({ type: 'key', raw }, [ch.port2]);
    setTimeout(resolve, 2000);
  });
}
function lockForm() {
  return new Promise((resolve) => {
    const input = el('input', { type: 'password', autocomplete: 'current-password', 'aria-label': '合言葉', placeholder: '合言葉', 'data-testid': 'lock-pass' });
    const errEl = el('div', { class: 'err', 'aria-live': 'polite' });
    const btn = el('button', { 'data-testid': 'lock-open' }, '開く');
    const go = async () => {
      if (!input.value.trim()) { errEl.textContent = '合言葉を入れてください'; return; }
      btn.disabled = true; errEl.textContent = 'たしかめています…';
      const raw = await derive(input.value);
      if (await tryKey(raw)) { await idb('readwrite', (s) => s.put(raw, 'raw')); resolve(raw); }
      else { errEl.textContent = '合言葉がちがいます。もう一度入れてください。'; btn.disabled = false; input.select(); }
    };
    btn.addEventListener('click', go);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    page(
      el('p', {}, 'このページは、合言葉を知っている人だけが使えます。お知らせした合言葉を入れてください。'),
      el('div', { class: 'card' }, input, errEl, btn, el('p', { class: 'muted', style: 'margin:12px 0 0' }, 'このパソコンのこのブラウザでは、次から合言葉を聞かれません。')),
      el('p', { class: 'muted' }, '動画は、このパソコンのブラウザの中だけで処理されます（どこにも送られません）。'),
    );
    input.focus();
  });
}

// ---------- ③ 本体 ----------
async function loadApp() {
  await new Promise((resolve) => {
    const l = el('link', { rel: 'stylesheet', href: 'app/css/app.css' });
    l.onload = resolve; l.onerror = resolve;
    document.head.append(l);
  });
  const m = await import('./app/js/main.js');
  m.start();
}

(async () => {
  const k = check();
  if (k !== 'ok' && !/[?&]anybrowser\b/.test(location.search)) { unsupported(k); return; }
  try {
    if (LOCK) {
      await swReady();
      let raw = await idb('readonly', (s) => s.get('raw')).catch(() => null);
      if (!raw || !(await tryKey(raw))) raw = await lockForm();
      page(el('p', { class: 'muted' }, '読み込んでいます…'));
      await giveKey(raw);
    }
    await loadApp();
  } catch (e) {
    if (e && e.message === 'reload') return;
    console.error(e);
    page(el('p', {}, '読み込めませんでした。ページを再読み込みしてください。'), el('p', { class: 'muted' }, String(e && e.message || e)));
  }
})();
