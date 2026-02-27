<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai> -->

# ENG: Core Engine

This component defines the adapter registry, `runAgent()`, `runParallel()`, and event helpers per [DR-002](../decisions/002-unified-event-stream-and-adapter-interface.md).

## Adapter Registry

### ENG-001

The registry shall support `register`, `get`, `list`, and `unregister` operations. `register` shall throw when the `agent` name is already registered; `get` shall return the adapter or `undefined`; `list` shall return registered agent names; `unregister` shall return `true` if found and removed, `false` otherwise.

## Event Helpers

### ENG-002

The engine shall export `createEvent()`, `generateSessionId()`, and `isAgentEvent()` helpers for constructing events, generating unique session IDs, and runtime type-guarding `AgentEvent` values.

## runAgent()

### ENG-003

When the requested agent name has no registered adapter, `runAgent()` shall throw.

### ENG-004

When the adapter's generator throws and no `done` event has been yielded, `runAgent()` shall yield an `error` event (`code: 'ADAPTER_ERROR'`, `recoverable: false`) followed by a `done` event (`status: 'error'`). When the throw occurs after `done`, the exception shall be swallowed.

### ENG-005

When the `AbortSignal` fires and no `done` event has been yielded, `runAgent()` shall call `.return()` on the adapter generator and yield a `done` event (`status: 'interrupted'`). When the signal is already aborted before `.run()` is called, `runAgent()` shall yield `done` (`status: 'interrupted'`) without calling `.run()`.

### ENG-006

Once a `done` event is yielded (whether from the adapter or synthesized), the engine shall call `.return()` on the generator and suppress all subsequent events. No event of any type shall follow `done`.

### ENG-007

Exactly one `done` event shall be yielded per session.

### ENG-008

When the adapter's generator exhausts without yielding a `done` event, `runAgent()` shall yield an `error` event (`code: 'MISSING_DONE'`, `recoverable: false`) followed by a `done` event (`status: 'error'`).

### ENG-009

Synthesized `done` payloads shall use zeroed usage (`inputTokens: 0`, `outputTokens: 0`, `toolUses: 0`) and `durationMs` measured from when the adapter's `.run()` was called. An adapter-emitted `done` shall take precedence over synthesis.

## runParallel()

### ENG-010

`runParallel()` shall merge multiple adapter streams, yielding events from each adapter as they become available.

### ENG-011

When one adapter's generator throws and no `done` has been yielded for that adapter, `runParallel()` shall yield an `error` event and `done` event for that adapter and remove it from the pool. Remaining adapters shall continue.

### ENG-012

When the `AbortSignal` fires, `runParallel()` shall call `.return()` on all active generators and yield a `done` event (`status: 'interrupted'`) for each active adapter.

## Tool Filtering

### ENG-013

When `allowedTools` is set, adapters shall restrict available tools to that list. When `disallowedTools` is also set, adapters shall further exclude those tools from the allowed set. Tool names shall be matched as exact identifiers unless the adapter explicitly documents pattern support per [DR-002](../decisions/002-unified-event-stream-and-adapter-interface.md#adapter-interface).
