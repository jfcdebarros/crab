# crab · monitor de arbitragem na B3

Plataforma que calcula, a partir dos termos de cada operação, os spreads de eventos corporativos (OPAs, incorporações, permutas), holdings × subsidiárias, ON × PN, units e ADRs. Tem uma aba **Documentos** onde se anexa um fato relevante e a IA extrai os parâmetros com página e trecho de origem.

**Hoje:** preços de fechamento salvos em `frontend/data.json` + cotações digitadas no painel Cotações. **Depois:** preços ao vivo pela Cedro (o código já está pronto, falta o contrato).

## Onde fica cada coisa

| Arquivo | O que tem | Quando mexer |
|---|---|---|
| `frontend/data.json` | Termos de cada operação (relação de troca, preço, datas, cláusulas, fontes), holdings, ON×PN, units, ADRs, calendário, preços de fechamento, nome do usuário | Para incluir ou atualizar uma operação ou preço |
| `frontend/head.html` | Visual: cores, fontes, cabeçalho, layout | Para mudar a aparência |
| `frontend/engine.js` | Motor de cálculo: dias úteis, Selic, spreads de cada modelo | Para mudar ou criar uma fórmula |
| `frontend/docs.js` | Aba Documentos: leitura do PDF, pedido à IA, conferências, aprovação | Para mudar o fluxo de documentos |
| `frontend/app.js` | Telas de cada aba, painel lateral, cotações | Para mudar o que aparece em cada aba |
| `frontend/build.py` | Junta tudo num único `frontend/dist/index.html` | Não precisa mexer |
| `backend/` | Servidor para preços ao vivo (Cedro, Banco Central) e testes | Só quando a Cedro entrar |

## Ver o crab no seu computador (precisa só de Python)

```bash
python frontend/build.py
```

Depois abra `frontend/dist/index.html` com dois cliques. Pronto: é o crab inteiro, sem servidor.

Ciclo de edição: muda um arquivo em `frontend/` → roda `python frontend/build.py` de novo → recarrega a página (F5).

## Trabalhar em dupla pelo GitHub

1. **Dono do repositório:** em *Settings → Collaborators → Add people*, convide o amigo pelo usuário do GitHub.
2. **Cada um:** instala o [GitHub Desktop](https://desktop.github.com), faz *File → Clone repository* e escolhe o `crab`.
3. **Antes de começar a editar:** *Fetch origin / Pull* (pega o que o outro mudou).
4. **Depois de editar:** escreve uma frase do que mudou, *Commit to main*, depois *Push origin*.
5. Para não um apagar o trabalho do outro: combinem quem mexe em qual arquivo, ou cada um trabalha numa *branch* e abre um *Pull Request* para o outro revisar.

Regra de ouro para números: toda mudança em `data.json` deve citar a fonte (fato relevante, edital) em `sources` da operação, e a outra pessoa confere o número contra o documento antes de aprovar.

## Testes do servidor (opcional)

```bash
pip install -r requirements.txt
cd backend
python -m pytest -q
```

## Preços ao vivo (quando houver contrato com a Cedro)

O servidor em `backend/` já faz login na Cedro, busca as cotações a cada 2 s, valida cada preço (atrasado, livro cruzado, salto suspeito) e bloqueia o spread com **não operar** quando algum insumo não é confiável. Para ligar: variável `CRAB_FEED=cedro` com `CEDRO_LOGIN` e `CEDRO_PASSWORD` (nunca escreva senhas em arquivo do repositório) e hospedar num serviço que rode Docker. Teste local com preços simulados: `cd backend && CRAB_FEED=mock uvicorn app.main:app --port 8000`.

## Limitações atuais

- A extração por IA da aba Documentos funciona na versão publicada no Claude; aberto direto do arquivo, o documento fica na fila.
- Termos aprovados na aba Documentos ficam salvos só no navegador de quem aprovou. Para valer para todos, leve-os ao `data.json`.
- PDF digitalizado (imagem) ainda não é lido: falta OCR.
- Calendário de feriados vai até 2028.
