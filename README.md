# DevStudy: como adicionar conteúdo

Tudo o que você vai adicionar fica na pasta `data/`. Salve o arquivo e aperte F5 no navegador.

| Quero adicionar...        | Edite                | Copie uma linha como esta |
|---------------------------|----------------------|---------------------------|
| Vídeo do YouTube          | `data/videos.json`   | `{"titulo":"...","canal":"...","id":"ID_DO_VIDEO","categoria":"python","nivel":"Iniciante"}` |
| Curso / plataforma        | `data/cursos.json`   | `{"titulo":"...","desc":"...","url":"https://...","categoria":"web","tipo":"gratis","imagem":""}` |
| Uma IA                    | `data/ias.json`      | igual aos cursos, com `"categoria":"ia-chat"` |
| Download                  | `data/downloads.json`| igual aos cursos, com `"categoria":"dl-linguagens"` |
| Categoria nova            | `data/categorias.json` | `{"id":"redes","nome":"Redes","icone":"ph:wifi-high-fill","cor":"#2dd4bf","home":true}` |
| Trilha de estudo          | `data/trilhas.json`  | copie uma trilha inteira |
| Nome do site / vídeo      | `data/site.json`     | |

- **ID do vídeo**: é o código depois de `v=` no link do YouTube (`youtube.com/watch?v=ABC123` → `ABC123`).
- **tipo**: `gratis`, `pago` ou `misto`.
- **Imagens**: coloque o arquivo em `static/img/` e escreva só o nome em `"imagem": "meu-curso.png"` (ou use um link completo `https://...`).
- **Ícones**: qualquer nome de https://icones.js.org/collection/ph (ex.: `ph:rocket-fill`).
- Cuidado com as vírgulas: entre itens vai vírgula, no último item não. Se errar, o site mostra em qual linha.

## Onde fica cada coisa
- `app.py` rotas e leitura dos dados
- `templates/` páginas (`partials/cards.html` define como cada card aparece)
- `static/css/` visual (`base.css` cores e menu, `components.css` cards, `editor.css` editor)
- `static/js/` comportamento (`catalogo.js` filtros, `editor.js` editor online)
- `static/media/` vídeo do avatar

## Rodar
```
pip install -r requirements.txt
python app.py
```
Abra http://127.0.0.1:5000
