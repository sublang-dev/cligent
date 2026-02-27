<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai> -->

# TADAPT: Adapter Tests

Verification criteria for all adapters. Shared patterns apply to each adapter; per-adapter sections cover unique behaviors.

## Shared

### TADAPT-001

Given canned native events for each adapter, when running the adapter, the yielded `AgentEvent` types shall match the normalization table for that adapter.

### TADAPT-002

Where the adapter uses an SDK (Claude Code, Codex, OpenCode), when the SDK is not installed, `isAvailable()` shall return `false` and `run()` shall throw.

### TADAPT-003

When `AbortSignal` fires during an adapter's `run()`, the adapter shall yield `done` (`status: 'interrupted'`).

### TADAPT-004

Given all `PermissionLevel` combinations, each adapter shall map `PermissionPolicy` to the correct vendor-specific controls.

## Claude Code

### TADAPT-005

Given `PermissionPolicy` combinations, the Claude Code adapter shall produce the correct `permissionMode` and `canUseTool` callback behavior for all permission-mode branches (bypass, acceptEdits, default with allow, default with deny).

## Codex

### TADAPT-006

The Codex adapter shall emit `codex:file_change` extension events for file changes, and when `resume` is provided, shall call `resumeThread(threadId)`.

## Gemini

### TADAPT-007

Given partial lines, malformed JSON, and empty lines, `parseNDJSON()` shall produce the correct `NDJSONParseResult` values. Given process exit codes 0, 1, 42, and 53, the Gemini adapter shall yield the corresponding `done` status.

## OpenCode

### TADAPT-008

The OpenCode adapter shall filter events by `sessionId`, emit `opencode:file_part` and `opencode:image_part` extension events, manage the server lifecycle in managed mode, and yield `error` (`code: 'OPENCODE_SERVER_EXIT'`) followed by `done` (`status: 'error'`) on server crash.

## Tool Filtering

### TADAPT-009

Given `allowedTools` and `disallowedTools` options, each adapter shall restrict tools according to whitelist and precedence semantics per [ENG-013](../user/engine.md#eng-013).
