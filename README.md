# research_aperture

The public home for two research threads: **When the Model Learns the Policy**
(internal codename *Aperture*) and **Neural Rhythm Generation**.

Static site. No backend, no database, no analytics.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/
npm run preview
```

## Deploy (Cloudflare Pages)

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Root directory | *(repo root)* |
| Node version | 20 |

`public/_redirects` contains `/* /index.html 200`. Without it, deep links such as
`/when-the-model-learns-the-policy` 404 on reload.

## Structure

```
src/
├── content/
│   ├── index.ts                     item metadata — the only file that decides what publishes
│   ├── aperture/                    copy of ideabox/research-aperture/
│   └── neural-rhythm-generation.md
├── components/                      Layout, Markdown, ItemCard, StatusBadge
└── pages/                           IndexPage, ItemPage
```

## Curation rules

1. **Only two items publish.** Nothing else from the ideabox corpus appears here.
   `drafts/`, `strategy/`, `personal/` and `projects/` are deliberately absent.
2. **Status lines describe what exists**, never what is intended. If a thread has no
   results, the card says so.
3. **Content is authored here.** This is a standalone repo; it never reads from
   `ideabox/` at build time.

## Known duplication

`src/content/aperture/*.md` are copies of `ideabox/research-aperture/` (00, 01, 02),
minus each file's trailing `## Next` block, which names local code paths and belongs to
the working wiki rather than to a reader.

The wiki is the thinking space; this repo holds the published text. When a wiki doc
changes materially, copy it across. Three files is small enough that drift is visible in
a diff.

## Owed

- [ ] **Neural Rhythm Generation** has no code link yet. When there is a public repo,
      add `link: { label: 'Source', href: '…' }` to that item in `src/content/index.ts`
      and remove its `unavailable` field.
- [ ] Neural Rhythm Generation has three `TODO (Jide)` markers — model family, corpus
      size, evaluation method.
- [ ] Aperture's study (docs 03–06 and the simulator) is not started. When results exist,
      add them here rather than rewriting the specification.
