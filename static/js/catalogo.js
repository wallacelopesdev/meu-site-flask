// CATÁLOGO: busca, filtros por categoria/tipo e player do YouTube
(() => {
  const grid = document.getElementById('grid');
  const itens = [...grid.children];
  const estado = { cat: 'todas', tipo: 'todos', q: '' };
  const cat = new URLSearchParams(location.search).get('cat');   // ex.: /cursos?cat=python
  if (cat && document.querySelector(`[data-filtro="cat:${cat}"]`)) estado.cat = cat;

  function aplicar() {
    let n = 0;
    itens.forEach(el => {
      const ok = (estado.cat === 'todas' || el.dataset.cat === estado.cat)
              && (estado.tipo === 'todos' || el.dataset.tipo === estado.tipo)
              && el.dataset.busca.includes(estado.q);
      el.hidden = !ok; if (ok) n++;
    });
    document.getElementById('vazio').hidden = n > 0;
    document.getElementById('contagem').textContent = n + (n === 1 ? ' resultado' : ' resultados');
    document.querySelectorAll('[data-filtro]').forEach(b => {
      const [k, v] = b.dataset.filtro.split(':');
      b.setAttribute('aria-pressed', estado[k] === v);
    });
  }
  document.querySelectorAll('[data-filtro]').forEach(b => b.onclick = () => {
    const [k, v] = b.dataset.filtro.split(':'); estado[k] = v; aplicar();
  });
  document.getElementById('busca').addEventListener('input', e => { estado.q = e.target.value.trim().toLowerCase(); aplicar(); });

  // clicar na miniatura troca pela janela do YouTube
  grid.addEventListener('click', e => {
    const b = e.target.closest('[data-yt]'); if (!b) return;
    const f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.yt + '?autoplay=1&rel=0';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true; f.title = 'Vídeo do YouTube';
    b.replaceWith(f);
  });
  aplicar();
})();
