<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai> -->

# IR-002: Core Engine and Adapter Registry

## Goal

Implement the core engine: an adapter registry for managing agent adapters, the `runAgent()` entry point that looks up an adapter and yields events, and `runParallel()` for merging multiple agent streams — per the driver-adapter architecture in [DR-002](../decisions/002-unified-event-stream-and-adapter-interface.md#driver-adapter-architecture).

## Deliverables

- [ ] `src/registry.ts` — `AdapterRegistry` class
- [ ] `src/engine.ts` — `runAgent()` and `runParallel()` functions
- [ ] `src/events.ts` — event factory helpers (`createEvent`, `generateSessionId`, `isAgentEvent`)
- [ ] Unit tests with mock adapters
- [ ] Updated `src/index.ts` exports

## Tasks

1. **Implement `AdapterRegistry`** (`src/registry.ts`)
   - `register(adapter: AgentAdapter): void` — registers by `adapter.agent`; throws on duplicate
   - `get(agent: AgentType): AgentAdapter | undefined` — lookup by agent name
   - `list(): AgentType[]` — return registered agent names
   - `unregister(agent: AgentType): boolean` — remove an adapter; return `true` if found

2. **Implement `runAgent()`** (`src/engine.ts`)
   - Accepts `agent: AgentType`, `prompt: string`, `options?: AgentOptions`, and a registry
   - Looks up adapter via registry; throws if not found
   - Calls `adapter.run(prompt, options)` and yields each `AgentEvent`
   - Propagates `AbortSignal` from options per [DR-002](../decisions/002-unified-event-stream-and-adapter-interface.md#session-control)

3. **Implement `runParallel()`** (`src/engine.ts`)
   - Accepts array of `{ adapter, prompt, options }` tasks per [DR-002](../decisions/002-unified-event-stream-and-adapter-interface.md#parallel-execution)
   - Merges streams using `Promise.race` on pending `next()` calls
   - Tags events with `adapter.agent` (already in `BaseEvent`)
   - Isolates errors: one adapter failure does not terminate others
   - Supports `AbortSignal` for cancelling all streams; calls `.return()` on active generators to trigger resource cleanup

4. **Implement event factory helpers** (`src/events.ts`)
   - `createEvent(type, agent, payload, sessionId?)` — returns a fully populated `AgentEvent` with timestamp and sessionId
   - `generateSessionId()` — returns a unique session identifier
   - `isAgentEvent(value: unknown): value is AgentEvent` — type guard for runtime validation

5. **Update `src/index.ts`**
   - Re-export `AdapterRegistry`, `runAgent`, `runParallel`, and event helpers

6. **Write unit tests**
   - Mock adapter implementing `AgentAdapter` that yields canned events
   - Test registry CRUD operations (register, get, list, unregister, duplicate rejection)
   - Test `runAgent()` end-to-end with mock adapter
   - Test `runParallel()` with multiple mock adapters, verifying interleaved events
   - Test `AbortSignal` cancellation for both `runAgent()` and `runParallel()`
   - Test error isolation in `runParallel()` (one failing adapter, others continue)

## Verification

- `tsc --noEmit` passes
- `vitest run` passes all unit tests
- Mock adapter tests cover registry CRUD, single-agent streaming, parallel streaming, abort, and error isolation
