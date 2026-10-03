// JS GLOBAL: roda em todas as páginas
const $ = id => document.getElementById(id);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// brilho que segue o mouse
addEventListener('pointermove', e => { const g = $('glow'); g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; });

// menu do celular
(() => {
  const btn = $('menuBtn'), box = $('mobile');
  const set = open => { box.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); $('menuIcon').setAttribute('icon', open ? 'ph:x-bold' : 'ph:list-bold'); };
  btn.onclick = () => set(!box.classList.contains('open'));
  box.querySelectorAll('a').forEach(a => a.onclick = () => set(false));
})();

// vídeo do avatar (só existe na home): botão de pausar/tocar
(() => {
  const vid = $('vid'); if (!vid) return;
  const sync = () => { $('vidIcon').setAttribute('icon', vid.paused ? 'ph:play-fill' : 'ph:pause-fill'); $('vidBtn').setAttribute('aria-label', vid.paused ? 'Tocar vídeo' : 'Pausar vídeo'); };
  if (reduce) vid.pause();
  $('vidBtn').onclick = () => vid.paused ? vid.play() : vid.pause();
  vid.addEventListener('play', sync); vid.addEventListener('pause', sync); sync();
})();
