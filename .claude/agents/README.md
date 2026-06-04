# Agent matrix — reusable, token-efficient

Tech-agnostic core agents + Vue/Vite frontend specialists. Scoped tools, model tiering, strict output limits.

## Active agents

| Agent | Model | Role | MCP wired in |
|---|---|---|---|
| **explorer** | opus 4.7 | read-only lookup (any repo) | context7 (lib docs) |
| **verifier** | opus 4.7 | typecheck / lint / test runner | — |
| **architect** | opus 4.8 | orchestrator, decompose + delegate, no edits | sequential-thinking |
| **frontend** | opus 4.8 | Vue 3 + Vite + TS impl (impeccable-led, SEO, Playwright) | context7 |
| **ui-ux** | opus 4.8 | UI/UX, impeccable-led design | context7 |
| **browser** | opus 4.7 | live browser UI testing (no test files) | playwright-cli skill |
| **reviewer** | opus 4.8 | read-only pre-merge gate | context7 |
| **blender-modeler** | opus 4.8 | builds/edits 3D models in live Blender | blender (+ context7) |
| **blender-exporter** | opus 4.8 | exports scene → web-ready .glb into the app | blender |
| **web3d** | opus 4.8 | renders .glb in Vue (TresJS/three.js) | context7 |

Opus-only roster: light/throwaway work → `claude-opus-4-7`; everything else → `claude-opus-4-8`. No sonnet/haiku.

## Frontend/design skill pipeline (frontend + ui-ux agents)
Both preload **`impeccable`** + **`vue-vite-stack`**. `vue-vite-stack` routes to the installed antfu Vue skills (`vue-best-practices`, `vue`, `vue-router-best-practices`, `vue-pinia-best-practices`, `vueuse`, `reka-ui`) and the project **`vite`** skill (Vite 8) as the task needs. impeccable is the lead — reads `PRODUCT.md`/`DESIGN.md`, dictates design system + code template + rules. Pipeline per task:
`impeccable` (decides) → `ui-ux-pro-max` (plan) + `frontend-design:frontend-design` (execute) → back to `impeccable` (arbitrate).
- Verification: **live in browser, no test files** — delegate to the `browser` agent (drives Chrome via the `playwright-cli` skill: open → click → snapshot → console/network → resize 375·768·1280). Never write `.spec.ts` or Playwright code.
- SEO: `seo` skill on every page (title/meta/OG/JSON-LD/sitemap) from the start.
- Nothing ships without impeccable. Execution skills never override it.

## Delegation flow

```
user → architect (only when cross-module / ambiguous)
        ├─ explorer    (reuse-check + lookups)        [read-only]
        ├─ frontend    (components / composables)      [parallel chunks]
        ├─ ui-ux       (visual + browser verify)
        ├─ verifier    (typecheck / lint / test)
        └─ reviewer    (final gate)

Single, clear task → call the domain agent directly (skip architect).
Lookup-only → explorer.  Validation-only → verifier.
```

## 3D pipeline (Blender → web)

```
blender-modeler → blender-exporter → web3d
  (build/edit in    (export GLB,        (render .glb in
   live Blender)     web-optimized,      Vue via TresJS,
                     into public/)       browser-verified)
```

Requires a **live Blender 5.1** with the official MCP add-on enabled (auto TCP bridge on `localhost:9876`)
and the user-scope `blender` MCP server connected — independent of `enabledMcpjsonServers` (that key only
governs project `.mcp.json` servers). Verify with `claude mcp list` → `blender ✓ Connected`.
- Handoff contract: modeler applies transforms + Principled BSDF + UVs → exporter emits Y-up Draco GLB +
  thumbnail into `public/models/` → web3d loads with GLTFLoader (+ DRACOLoader) and verifies live in-browser.
- All three only edit their own scope; the Blender agents never touch repo source except the exported asset.

## MCP usage policy (applies to every agent)

| MCP | Tool prefix | Use for |
|---|---|---|
| context7 | `mcp__context7__*` | library/framework/API docs BEFORE coding against them |
| sequential-thinking | `mcp__sequential-thinking__*` | hard multi-step reasoning (architect only) |
| codegraph *(optional)* | `mcp__codegraph__*` | reuse-check / impact analysis if the project has it |

To give an agent a new MCP tool: add its `mcp__server__tool` name to that agent's `tools:` frontmatter line.
**Future tech:** when adding backend/db/etc., copy a block from `TEMPLATES.md`, keep the same MCP-in-tools pattern.

## Token-efficiency rules (every agent)

1. Read with `offset`+`limit` — never full files.
2. Output ≤ 20 lines — structured blocks, `file:line` + one-liner, no code dumps.
3. Delegate lookups to `explorer`, checks to `verifier` — keep main context clean.
4. Prefer Glob/Grep/Read over `cat`/`find`/`grep` in Bash.
5. Opus-only — `claude-opus-4-7` for light work, `claude-opus-4-8` otherwise (see matrix).

## Customization

Edit a `<name>.md` to tune `description` (auto-selection trigger), `model`, `tools`, or workflow.
Keep each agent under ~50 lines. `model: inherit` to follow the main session.
