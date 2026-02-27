<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai> -->

# TENG: Engine Tests

Verification criteria for the core engine and adapter registry.

## Registry

### TENG-001

Given a mock adapter, when registering, getting, listing, and unregistering, the registry shall perform CRUD operations correctly, including duplicate-name rejection.

## runAgent()

### TENG-002

Given a mock adapter that yields canned events, when calling `runAgent()`, the consumer shall receive all expected `AgentEvent` values in order.

### TENG-003

When `AbortSignal` fires during `runAgent()`, the engine shall yield `done` (`status: 'interrupted'`) and no further events.

### TENG-004

When the adapter's generator throws before `done`, the engine shall yield `error` (`code: 'ADAPTER_ERROR'`) then `done` (`status: 'error'`). When the throw occurs after `done`, the engine shall suppress the exception and yield no additional events.

### TENG-005

When the adapter's generator exhausts without yielding `done`, the engine shall yield `error` (`code: 'MISSING_DONE'`) then `done` (`status: 'error'`).

### TENG-006

When `AbortSignal` fires concurrently with the adapter emitting its own `done`, the engine shall yield exactly one `done` event per session (done-cardinality race).

## runParallel()

### TENG-007

Given multiple mock adapters, when calling `runParallel()`, the consumer shall receive interleaved events with per-adapter `done` events.

### TENG-008

When one adapter throws in `runParallel()`, the engine shall yield `error` + `done` for that adapter; remaining adapters shall continue unaffected.

### TENG-009

When an adapter's generator exhausts without yielding `done` inside `runParallel()`, the engine shall yield `error` (`code: 'MISSING_DONE'`) then `done` (`status: 'error'`) for that adapter; remaining adapters shall continue unaffected.
