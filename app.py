"""
Servidor da plataforma. Você quase nunca precisa mexer aqui:
para adicionar conteúdo, edite os arquivos da pasta data/.
"""
import json
from pathlib import Path
from flask import Flask, render_template, abort

DATA = Path(__file__).parent / "data"
app = Flask(__name__)

# páginas que listam itens de data/<nome>.json (título, subtítulo, texto do botão)
CATALOGOS = {
    "videos":    {"titulo": "Vídeos",               "acao": "Assistir", "sub": "Aulas do YouTube separadas por categoria. Clique na miniatura para assistir aqui mesmo."},
    "cursos":    {"titulo": "Cursos e plataformas", "acao": "Acessar",  "sub": "Plataformas de ensino grátis e pagas para estudar com método."},
    "ias":       {"titulo": "Assistentes de IA",    "acao": "Abrir",    "sub": "IAs para tirar dúvidas, explicar código e revisar seus projetos."},
    "downloads": {"titulo": "Downloads",            "acao": "Baixar",   "sub": "Instaladores oficiais das linguagens e ferramentas."},
}
TIPOS = {"gratis": "Grátis", "pago": "Pago", "misto": "Grátis + pago"}


def carregar(nome):
    """Lê data/<nome>.json a cada acesso: salvou o arquivo, deu F5, apareceu."""
    try:
        return json.loads((DATA / f"{nome}.json").read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        abort(500, description=f"Erro no arquivo data/{nome}.json, linha {e.lineno}: {e.msg}. "
                               "Geralmente falta uma vírgula ou aspas.")


@app.context_processor
def globais():
    cats = carregar("categorias")
    return {"site": carregar("site"), "cats": cats,
            "cat_por_id": {c["id"]: c for c in cats}, "tipos_nome": TIPOS}


@app.route("/")
def index():
    videos, cursos = carregar("videos"), carregar("cursos")
    home_cats = []
    for c in carregar("categorias"):
        if c.get("home"):
            home_cats.append({**c,
                              "videos": sum(v.get("categoria") == c["id"] for v in videos),
                              "cursos": sum(v.get("categoria") == c["id"] for v in cursos)})
    contagem = {k: len(carregar(k)) for k in CATALOGOS}
    return render_template("index.html", home_cats=home_cats, contagem=contagem)


def montar_catalogo(chave):
    itens = carregar(chave)
    usadas = {i.get("categoria") for i in itens}
    tipos = []
    for i in itens:
        if i.get("tipo") and i["tipo"] not in tipos:
            tipos.append(i["tipo"])
    return render_template("catalogo.html", chave=chave, cfg=CATALOGOS[chave], itens=itens,
                           cats_usadas=[c for c in carregar("categorias") if c["id"] in usadas], tipos=tipos)


for _chave in CATALOGOS:
    app.add_url_rule(f"/{_chave}", endpoint=_chave, view_func=lambda c=_chave: montar_catalogo(c))


@app.route("/trilhas")
def trilhas():
    return render_template("trilhas.html", trilhas=carregar("trilhas"))


@app.route("/editor")
def editor():
    return render_template("editor.html")


if __name__ == "__main__":
    app.run(debug=True)
