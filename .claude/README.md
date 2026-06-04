# Reusable `.claude` — Frontend-first, tech-agnostic core

A portable Claude Code config you can drop into **any** project and start working immediately.
Default specialization: **Vue 3 + Vite + TypeScript**. The core (agents, MCP/skill/model policy,
token rules) is tech-agnostic and extends cleanly to other stacks.

## What's in here
```
CLAUDE.md                  ← core rules: model routing, delegation, MCP/skill policy, token rules
PRODUCT.md                 ← impeccable context: users, brand, tone, principles (fill per project)
DESIGN.md                  ← impeccable context: color, type, spacing, components (fill per project)
.mcp.json                  ← portable MCP servers (context7, playwright, sequential-thinking)
.claude/
  settings.json            ← permissions, plugin enablement, MCP approval, env
  README.md                ← this file
  skills/
    playwright-cli/        ← live browser driver (open/click/snapshot — no test files)
    vite/                  ← Vite 8 (config, dev/HMR, build/SSR, migration) + references/
    vue-vite-stack/        ← orchestrator: composes installed Vue skills + vite, project conventions
  agents/
    README.md              ← agent matrix + MCP usage policy
    explorer.md   (opus 4.7) ← read-only lookup
    verifier.md   (opus 4.7) ← typecheck / lint / test
    browser.md    (opus 4.7) ← live browser UI testing (playwright-cli)
    architect.md  (opus 4.8) ← orchestrator (no edits)
    frontend.md   (opus 4.8) ← Vue/Vite implementation
    ui-ux.md      (opus 4.8) ← UI/UX design (impeccable-led)
    reviewer.md   (opus 4.8) ← pre-merge gate
    TEMPLATES.md           ← optional backend/db/devops/security agents (copy out to activate)
```

## How to reuse on a new project
1. Copy `CLAUDE.md`, `PRODUCT.md`, `DESIGN.md`, `.mcp.json`, and `.claude/` into the new project root.
2. Edit the **Stack** line in `CLAUDE.md`, and fill `PRODUCT.md` + `DESIGN.md` (the `impeccable` skill reads these to dictate the design system and code rules — `impeccable teach` / `document` can generate them).
3. Approve MCP servers on first run (or keep `enableAllProjectMcpServers: true` in settings.json).
4. If the stack changes (backend/db/infra appear):
   - Copy the matching block from `agents/TEMPLATES.md` into a new `agents/<name>.md`.
   - Add its MCP server to `.mcp.json` + `enabledMcpjsonServers`.
   - Flip the matching plugin to `true` in `settings.json` (`backend-development`, `database-design`, `pyright-lsp`, …).

## MCP servers
- **context7** — live library/framework docs. Use before coding against any lib.
- **sequential-thinking** — hard multi-step reasoning (architect).
- **codegraph** *(optional)* — if a project has code-intelligence set up, wire `mcp__codegraph__*` into
  `explorer`/`reviewer` for reuse-check and impact analysis.

First run downloads MCP packages via `npx -y`. If a server is already configured globally, the
project-scoped entry simply takes precedence — safe to keep, or remove that entry from `.mcp.json`.

## Browser testing (no MCP — uses the playwright-cli skill)
The `browser` agent drives Chrome **live** via the `playwright-cli` CLI (named sessions, ref snapshots,
console/network, screenshots). No `.spec.ts`, no `npx playwright test`. First-time setup on a machine:
`playwright-cli install --skills && playwright-cli install-browser`. Artifacts go to `.test-artifacts/` (gitignored).

## Model routing (Opus-only)
`claude-opus-4-7` → lookups & verification · `claude-opus-4-8` → implementation, review, UI, architecture, deep debugging.
No sonnet/haiku. Cost saving comes from delegating to subagents (clean context), not from tier. `token-guardian` reports usage each turn.

## Plugins
Enabled: superpowers, frontend-design, code-simplifier, commit-commands, typescript-lsp, caveman,
elements-of-style, claude-code-setup. Everything backend/python/rust/k8s/docs is disabled for token
economy — flip to `true` in `settings.json` when a project needs it. `oh-my-claudecode` is intentionally
not listed here so your global OMC setting governs.
