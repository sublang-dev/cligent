// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

import { describe, it, expectTypeOf } from 'vitest';
import type {
  AgentEvent,
  AgentEventType,
  AgentAdapter,
  BaseEvent,
  TextPayload,
  PermissionPolicy,
} from '../types.js';

describe('core types', () => {
  it('narrows discriminated union on type field', () => {
    const event = {} as AgentEvent;
    if (event.type === 'text') {
      expectTypeOf(event.payload).toEqualTypeOf<TextPayload>();
    }
  });

  it('accepts namespaced extension events', () => {
    const event: AgentEvent = {
      type: 'codex:file_change',
      agent: 'codex',
      timestamp: Date.now(),
      sessionId: 'test',
      payload: { path: '/foo' },
    };
    expectTypeOf(event).toMatchTypeOf<AgentEvent>();
  });

  it('AgentAdapter.run() returns AsyncGenerator<AgentEvent>', () => {
    expectTypeOf<AgentAdapter['run']>().returns.toMatchTypeOf<
      AsyncGenerator<AgentEvent, void, void>
    >();
  });

  it('PermissionPolicy fields are optional', () => {
    const empty: PermissionPolicy = {};
    expectTypeOf(empty).toMatchTypeOf<PermissionPolicy>();
  });

  it('BaseEvent.type accepts AgentEventType and arbitrary strings', () => {
    expectTypeOf<AgentEventType>().toMatchTypeOf<BaseEvent['type']>();
    expectTypeOf<string>().toMatchTypeOf<BaseEvent['type']>();
  });
});
