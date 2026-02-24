<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai> -->

# Spec Map

Quick-reference guide for AI agents to locate the right spec file.
Spec files are source of truth.

## Layout

```text
decisions/   Architectural decision records (DR-NNN)
iterations/  Iteration records (IR-NNN)
dev/         Implementation requirements
user/        User-facing behavior
test/        Verification criteria
```

Specs use GEARS syntax ([META-001](user/meta.md#meta-001)).
Authoring rules: [dev/style.md](dev/style.md).

## Decisions

| ID | File | Summary |
| --- | --- | --- |
| DR-000 | [000-initial-specs-structure.md](decisions/000-initial-specs-structure.md) | Specs directory layout, GEARS syntax, naming conventions |
| DR-001 | [001-unified-cli-agent-interface-architecture.md](decisions/001-unified-cli-agent-interface-architecture.md) | TypeScript library with async generator interface across CLI agents |
| DR-002 | [002-unified-event-stream-and-adapter-interface.md](decisions/002-unified-event-stream-and-adapter-interface.md) | Unified Event Stream, driver-adapter contract, permission model |

## Iterations

| ID | File | Goal |
| --- | --- | --- |
| IR-000 | [000-spdx-headers.md](iterations/000-spdx-headers.md) | Add SPDX headers to applicable files |
| IR-001 | [001-project-scaffold-and-core-types.md](iterations/001-project-scaffold-and-core-types.md) | Project scaffold and all DR-002 core TypeScript interfaces |
| IR-002 | [002-core-engine-and-adapter-registry.md](iterations/002-core-engine-and-adapter-registry.md) | Adapter registry, runAgent(), runParallel(), event helpers |
| IR-003 | [003-claude-code-adapter.md](iterations/003-claude-code-adapter.md) | Claude Code adapter via @anthropic-ai/claude-agent-sdk |
| IR-004 | [004-codex-adapter.md](iterations/004-codex-adapter.md) | Codex adapter via @openai/codex-sdk |
| IR-005 | [005-gemini-cli-adapter.md](iterations/005-gemini-cli-adapter.md) | Gemini CLI adapter via child_process spawn + NDJSON |
| IR-006 | [006-opencode-adapter.md](iterations/006-opencode-adapter.md) | OpenCode adapter via @opencode-ai/sdk with SSE |

## Spec Files

### `dev/`

| File | Summary |
| --- | --- |
| [git.md](dev/git.md) | Commit message format and AI co-authorship trailers |
| [style.md](dev/style.md) | Spec naming, ID format, GEARS syntax, cross-refs, record format, and SPDX headers |

### `user/`

| File | Summary |
| --- | --- |
| [meta.md](user/meta.md) | GEARS syntax definition and test-spec mapping |

### `test/`

| File | Summary |
| --- | --- |
| [spdx-headers.md](test/spdx-headers.md) | Copyright and license header presence checks |
