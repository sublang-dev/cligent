<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai> -->

# cligent guide

## Install

```bash
npm install cligent
```

Each adapter that uses an SDK has an optional peer dependency. Install only the ones you need:

```bash
npm install @anthropic-ai/claude-agent-sdk   # Claude Code
npm install @openai/codex-sdk                 # Codex CLI
npm install @opencode-ai/sdk                  # OpenCode
# Gemini CLI uses a child process — no SDK required
```

## Quick start

```ts
import { AdapterRegistry, runAgent } from 'cligent';
import { ClaudeCodeAdapter } from 'cligent/adapters/claude-code';

const registry = new AdapterRegistry();
registry.register(new ClaudeCodeAdapter());

for await (const event of runAgent('claude-code', 'Fix the login bug', undefined, registry)) {
  switch (event.type) {
    case 'text_delta':
      process.stdout.write(event.payload.delta);
      break;
    case 'tool_use':
      console.log(`Tool: ${event.payload.toolName}`);
      break;
    case 'done':
      console.log(`\nFinished: ${event.payload.status}`);
      break;
  }
}
```

## Adapters

Register one or more adapters before calling `runAgent`.

**Claude Code**

```ts
import { ClaudeCodeAdapter } from 'cligent/adapters/claude-code';
registry.register(new ClaudeCodeAdapter());
```

**Codex CLI**

```ts
import { CodexAdapter } from 'cligent/adapters/codex';
registry.register(new CodexAdapter());
```

**Gemini CLI**

```ts
import { GeminiAdapter } from 'cligent/adapters/gemini';
registry.register(new GeminiAdapter());
```

**OpenCode**

```ts
import { OpenCodeAdapter } from 'cligent/adapters/opencode';
registry.register(new OpenCodeAdapter());
```

## Permissions

> Assumes `registry` and imports from [Quick start](#quick-start).

Control what the agent is allowed to do with `PermissionPolicy`:

```ts
import type { PermissionPolicy } from 'cligent';

const permissions: PermissionPolicy = {
  fileWrite: 'ask',       // prompt before writing files
  shellExecute: 'deny',   // block shell commands
  networkAccess: 'allow',
};

for await (const event of runAgent('claude-code', 'Refactor auth module', { permissions }, registry)) {
  // ...
}
```

Each capability accepts `'allow'`, `'ask'`, or `'deny'`.

## Parallel execution

Run multiple agents side-by-side with `runParallel`:

```ts
import { runParallel } from 'cligent';
import type { ParallelTask } from 'cligent';
import { ClaudeCodeAdapter } from 'cligent/adapters/claude-code';
import { GeminiAdapter } from 'cligent/adapters/gemini';

const tasks: ParallelTask[] = [
  { adapter: new ClaudeCodeAdapter(), prompt: 'Write unit tests' },
  { adapter: new GeminiAdapter(), prompt: 'Write integration tests' },
];

for await (const event of runParallel(tasks)) {
  console.log(`[${event.agent}] ${event.type}`);
}
```

Events from all agents are interleaved as they arrive. Each event carries an `agent` field so you can tell them apart.

## Abort

> Assumes `registry` and imports from [Quick start](#quick-start).

Cancel a running agent with a standard `AbortController`:

```ts
const ac = new AbortController();
setTimeout(() => ac.abort(), 30_000); // 30 s timeout

for await (const event of runAgent('claude-code', 'Fix the login bug', { abortSignal: ac.signal }, registry)) {
  // stream ends with a synthetic done event (status: 'interrupted') on abort
}
```

## Event types

Every event extends `BaseEvent` (`type`, `agent`, `timestamp`, `sessionId`) and carries a typed `payload`:

| Type | Payload | Description |
| --- | --- | --- |
| `init` | `model`, `cwd`, `tools` | Session started |
| `text` | `content` | Complete text response |
| `text_delta` | `delta` | Streaming text chunk |
| `thinking` | `summary` | Agent reasoning |
| `tool_use` | `toolName`, `toolUseId`, `input` | Tool invocation |
| `tool_result` | `toolUseId`, `status`, `output` | Tool outcome |
| `permission_request` | `toolName`, `toolUseId`, `input` | Agent asks for permission |
| `error` | `code`, `message`, `recoverable` | Error |
| `done` | `status`, `usage`, `durationMs` | Terminal event — always the last event |
