// EDITOR ONLINE: Monaco (o motor do VS Code), arquivos, executar e baixar
(() => {
  const $ = id => document.getElementById(id);

  // ---- linguagens: extensão -> nome, id do Monaco e código inicial. Para adicionar uma, copie uma linha.
  const LANGS = {
    html: { n: 'HTML', m: 'html', s: '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <title>Meu projeto</title>\n</head>\n<body>\n  <h1>Olá, mundo!</h1>\n</body>\n</html>\n' },
    css:  { n: 'CSS', m: 'css', s: 'body {\n  font-family: system-ui, sans-serif;\n}\n' },
    js:   { n: 'JavaScript', m: 'javascript', s: 'console.log("Olá, mundo!");\n' },
    ts:   { n: 'TypeScript', m: 'typescript', s: 'const msg: string = "Olá, mundo!";\nconsole.log(msg);\n' },
    py:   { n: 'Python', m: 'python', s: 'nome = "mundo"\nprint(f"Olá, {nome}!")\n' },
    java: { n: 'Java', m: 'java', s: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Olá, mundo!");\n    }\n}\n' },
    c:    { n: 'C', m: 'c', s: '#include <stdio.h>\n\nint main(void) {\n    printf("Olá, mundo!\\n");\n    return 0;\n}\n' },
    cpp:  { n: 'C++', m: 'cpp', s: '#include <iostream>\n\nint main() {\n    std::cout << "Olá, mundo!" << std::endl;\n    return 0;\n}\n' },
    cs:   { n: 'C#', m: 'csharp', s: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Olá, mundo!");\n    }\n}\n' },
    go:   { n: 'Go', m: 'go', s: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Olá, mundo!")\n}\n' },
    rs:   { n: 'Rust', m: 'rust', s: 'fn main() {\n    println!("Olá, mundo!");\n}\n' },
    php:  { n: 'PHP', m: 'php', s: '<?php\necho "Olá, mundo!";\n' },
    rb:   { n: 'Ruby', m: 'ruby', s: 'puts "Olá, mundo!"\n' },
    sql:  { n: 'SQL', m: 'sql', s: "SELECT 'Olá, mundo!' AS mensagem;\n" },
    sh:   { n: 'Shell', m: 'shell', s: '#!/bin/bash\necho "Olá, mundo!"\n' },
    json: { n: 'JSON', m: 'json', s: '{\n  "mensagem": "Olá, mundo!"\n}\n' },
    md:   { n: 'Markdown', m: 'markdown', s: '# Olá, mundo!\n' }
  };

  // ---- modelos de projeto: "web" é misto (3 arquivos); as outras são uma linguagem só
  const WEB = [
    { name: 'index.html', code: '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <title>Meu projeto</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Olá, mundo!</h1>\n  <p>Clique no título.</p>\n  <script src="script.js"></script>\n</body>\n</html>\n' },
    { name: 'style.css', code: 'body {\n  font-family: system-ui, sans-serif;\n  background: #0b0f14;\n  color: #fff;\n  display: grid;\n  place-items: center;\n  min-height: 100vh;\n}\nh1 { cursor: pointer; color: #2dd4bf; }\n' },
    { name: 'script.js', code: 'document.querySelector("h1").addEventListener("click", () => {\n  console.log("Funcionou!");\n  document.querySelector("p").textContent = "Você clicou!";\n});\n' }
  ];
  const PROJETOS = [['web', 'Web (HTML + CSS + JS)'], ...['py', 'js', 'ts', 'java', 'c', 'cpp', 'cs', 'go', 'rs', 'php', 'rb', 'sql', 'sh'].map(k => [k, LANGS[k].n])];

  let files = [], ativo = 0, ed = null, trocando = false, timer;
  const extDe = n => n.split('.').pop().toLowerCase();
  const atual = () => files[ativo];

  // ---- salvar no navegador
  const salvar = () => { clearTimeout(timer); timer = setTimeout(() => { try { localStorage.setItem('devstudy.editor', JSON.stringify({ files, ativo })); } catch (e) {} }, 400); };
  try { const s = JSON.parse(localStorage.getItem('devstudy.editor')); if (s && s.files && s.files.length) { files = s.files; ativo = Math.min(s.ativo || 0, files.length - 1); } } catch (e) {}
  if (!files.length) files = WEB.map(f => ({ ...f }));

  // ---- lista de arquivos
  function lista() {
    const box = $('arquivos'); box.replaceChildren();
    files.forEach((f, i) => {
      const row = document.createElement('div'); row.className = 'file' + (i === ativo ? ' on' : '');
      const b = document.createElement('button'); b.textContent = f.name; b.onclick = () => abrir(i);
      const x = document.createElement('button'); x.className = 'x'; x.textContent = '✕'; x.setAttribute('aria-label', 'Excluir ' + f.name);
      x.onclick = () => { if (files.length > 1 && confirm('Excluir ' + f.name + '?')) { files.splice(i, 1); ativo = Math.min(ativo, files.length - 1); abrir(ativo); } };
      row.append(b, x); box.append(row);
    });
  }
  function abrir(i) {
    ativo = i; trocando = true;
    ed.setValue(atual().code);
    if (window.monaco) monaco.editor.setModelLanguage(ed.getModel(), (LANGS[extDe(atual().name)] || { m: 'plaintext' }).m);
    trocando = false; lista(); salvar();
  }

  // ---- ações
  $('modelo').append(new Option('Novo projeto…', '', true, true));
  $('modelo').options[0].disabled = true;
  PROJETOS.forEach(([k, n]) => $('modelo').append(new Option(n, k)));
  $('modelo').onchange = e => {
    const k = e.target.value; e.target.selectedIndex = 0;
    if (!confirm('Começar um projeto novo? Os arquivos atuais serão substituídos.')) return;
    files = k === 'web' ? WEB.map(f => ({ ...f })) : [{ name: k === 'java' ? 'Main.java' : 'main.' + k, code: LANGS[k].s }];
    abrir(0); limpar();
  };
  $('novoArq').onclick = () => {
    const n = (prompt('Nome do arquivo (ex.: app.py, estilo.css, Main.java):') || '').trim();
    if (!n) return;
    if (!/^[\w.\- ]+\.\w+$/.test(n) || files.some(f => f.name === n)) return alert('Nome inválido ou já existe.');
    files.push({ name: n, code: (LANGS[extDe(n)] || { s: '' }).s }); abrir(files.length - 1);
  };
  function baixar(blob, nome) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nome; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
  $('dlArq').onclick = () => baixar(new Blob([atual().code], { type: 'text/plain;charset=utf-8' }), atual().name);
  $('dlZip').onclick = async () => {
    if (!window.JSZip) return alert('Não consegui carregar o gerador de .zip. Verifique sua internet.');
    const z = new JSZip(); files.forEach(f => z.file(f.name, f.code));
    baixar(await z.generateAsync({ type: 'blob' }), 'projeto.zip');
  };

  // ---- executar
  const preview = $('preview'), con = $('console');
  function log(tipo, txt) { const l = document.createElement('div'); l.className = tipo; l.textContent = txt; con.append(l); con.scrollTop = con.scrollHeight; }
  function limpar() { con.replaceChildren(); preview.srcdoc = ''; }
  $('limpar').onclick = () => con.replaceChildren();
  addEventListener('message', e => { if (e.source === preview.contentWindow && e.data && e.data.k) log(e.data.k, e.data.t); });

  const HOOK = '<script>(function(){const send=(k,a)=>parent.postMessage({k:k,t:a.map(function(x){try{return typeof x==="object"?JSON.stringify(x):String(x)}catch(e){return String(x)}}).join(" ")},"*");["log","info","warn","error"].forEach(function(k){const o=console[k];console[k]=function(){send(k,[].slice.call(arguments));o.apply(console,arguments)}});addEventListener("error",function(e){send("error",[e.message])});})();</script>';

  function montarWeb() {
    const h = files.find(f => f.name === 'index.html') || files.find(f => f.name.endsWith('.html'));
    const por = n => files.find(f => f.name === n);
    let d = h.code;
    d = d.replace(/<link[^>]+href=["']([^"']+\.css)["'][^>]*>/gi, (m, n) => por(n) ? '<style>' + por(n).code + '</style>' : m);
    d = d.replace(/<script[^>]+src=["']([^"']+\.js)["'][^>]*><\/script>/gi, (m, n) => por(n) ? '<script>' + por(n).code + '<\/script>' : m);
    return HOOK + d;
  }

  let pyodide;
  async function rodarPython(code) {
    try {
      if (!pyodide) {
        log('info', 'Carregando Python no navegador (só na primeira vez)…');
        await new Promise((ok, no) => { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js'; s.onload = ok; s.onerror = no; document.head.append(s); });
        pyodide = await loadPyodide();
      }
      pyodide.setStdout({ batched: t => log('log', t) });
      pyodide.setStderr({ batched: t => log('error', t) });
      await pyodide.runPythonAsync(code);
    } catch (err) { log('error', String(err.message || err)); }
  }

  function rodar() {
    limpar();
    const f = atual(), ext = extDe(f.name), temHtml = files.some(x => x.name.endsWith('.html'));
    if (ext === 'html' || ext === 'css' || (ext === 'js' && temHtml)) {
      if (!temHtml) return log('warn', 'Crie um arquivo .html para ver o resultado.');
      preview.srcdoc = montarWeb();
    } else if (ext === 'js') preview.srcdoc = HOOK + '<script>' + f.code + '<\/script>';
    else if (ext === 'py') rodarPython(f.code);
    else log('warn', ((LANGS[ext] || {}).n || ext) + ' não roda no navegador. Use "Baixar arquivo", instale a linguagem (página Downloads) e execute no seu computador.');
  }
  $('rodar').onclick = rodar;
  addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); rodar(); } });

  // ---- inicia o Monaco (ou um editor simples, se o CDN falhar)
  function simples() {
    const t = document.createElement('textarea'); t.setAttribute('aria-label', 'Código'); $('monaco').append(t);
    ed = { getValue: () => t.value, setValue: v => { t.value = v; }, getModel: () => null };
    t.oninput = () => { if (!trocando) { atual().code = t.value; salvar(); } };
    abrir(ativo);
  }
  const base = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min';
  const s = document.createElement('script'); s.src = base + '/vs/loader.min.js'; s.onerror = simples;
  s.onload = () => {
    require.config({ paths: { vs: base + '/vs' } });
    window.MonacoEnvironment = { getWorkerUrl: () => URL.createObjectURL(new Blob(["self.MonacoEnvironment={baseUrl:'" + base + "/'};importScripts('" + base + "/vs/base/worker/workerMain.js');"], { type: 'text/javascript' })) };
    require(['vs/editor/editor.main'], () => {
      ed = monaco.editor.create($('monaco'), { value: '', theme: 'vs-dark', automaticLayout: true, fontSize: 14, minimap: { enabled: false }, padding: { top: 12 }, scrollBeyondLastLine: false });
      ed.onDidChangeModelContent(() => { if (!trocando) { atual().code = ed.getValue(); salvar(); } });
      abrir(ativo);
    }, simples);
  };
  document.head.append(s);
})();
