// 公開版の「鍵あけ係」（Service Worker）。本体（app/ の下）は合言葉で暗号にして置いてあり、
// 合言葉から作った鍵を持っているブラウザの中でだけ、読むときに元に戻して渡す。鍵も中身も、どこにも送らない。
// pub/（モデル・部品・見本の動画）と、入口のファイルは、そのまま通す。
let key = null;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

function idbGet() {
  return new Promise((resolve) => {
    const rq = indexedDB.open('fc-lock', 1);
    rq.onupgradeneeded = () => rq.result.createObjectStore('k');
    rq.onerror = () => resolve(null);
    rq.onsuccess = () => {
      try { const g = rq.result.transaction('k', 'readonly').objectStore('k').get('raw'); g.onsuccess = () => resolve(g.result || null); g.onerror = () => resolve(null); } catch { resolve(null); }
    };
  });
}
async function getKey() {
  if (key) return key;
  const raw = await idbGet();
  if (!raw) return null;
  key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
  return key;
}
self.addEventListener('message', (e) => {
  const m = e.data || {};
  if (m.type === 'key' && m.raw) {
    key = null;
    crypto.subtle.importKey('raw', m.raw, 'AES-GCM', false, ['decrypt']).then((k) => { key = k; e.ports[0]?.postMessage('ok'); });
  }
});

const TYPES = { js: 'text/javascript; charset=utf-8', mjs: 'text/javascript; charset=utf-8', css: 'text/css; charset=utf-8', json: 'application/json; charset=utf-8', txt: 'text/plain; charset=utf-8', svg: 'image/svg+xml' };
async function serve(rel) {
  const k = await getKey();
  if (!k) return new Response('locked', { status: 403 });
  const r = await fetch(new URL(rel + '.enc', self.registration.scope), { cache: 'no-cache' });
  if (!r.ok) return new Response('not found', { status: 404 });
  const buf = new Uint8Array(await r.arrayBuffer());
  try {
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: buf.slice(0, 12) }, k, buf.slice(12));
    const ext = (rel.split('.').pop() || '').toLowerCase();
    return new Response(plain, { headers: { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' } });
  } catch { return new Response('locked', { status: 403 }); }
}
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin || e.request.method !== 'GET') return;
  const scope = new URL(self.registration.scope).pathname;
  if (!url.pathname.startsWith(scope)) return;
  const rel = decodeURIComponent(url.pathname.slice(scope.length));
  if (!rel.startsWith('app/') || rel.endsWith('.enc')) return;
  e.respondWith(serve(rel));
});
