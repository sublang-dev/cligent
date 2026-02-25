// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

import { describe, it, expect } from 'vitest';
import { AdapterRegistry } from '../registry.js';
import type { AgentAdapter, AgentEvent } from '../types.js';

function createStubAdapter(agent: string): AgentAdapter {
  return {
    agent,
    async *run(): AsyncGenerator<AgentEvent, void, void> {},
    async isAvailable() {
      return true;
    },
  };
}

describe('AdapterRegistry', () => {
  it('registers and retrieves an adapter', () => {
    const registry = new AdapterRegistry();
    const adapter = createStubAdapter('claude-code');
    registry.register(adapter);
    expect(registry.get('claude-code')).toBe(adapter);
  });

  it('throws on duplicate registration', () => {
    const registry = new AdapterRegistry();
    registry.register(createStubAdapter('claude-code'));
    expect(() => registry.register(createStubAdapter('claude-code'))).toThrow(
      'Adapter already registered for agent: claude-code',
    );
  });

  it('returns undefined for unknown agent', () => {
    const registry = new AdapterRegistry();
    expect(registry.get('codex')).toBeUndefined();
  });

  it('lists registered agent names', () => {
    const registry = new AdapterRegistry();
    registry.register(createStubAdapter('claude-code'));
    registry.register(createStubAdapter('codex'));
    expect(registry.list()).toEqual(['claude-code', 'codex']);
  });

  it('unregister returns true for existing adapter', () => {
    const registry = new AdapterRegistry();
    registry.register(createStubAdapter('claude-code'));
    expect(registry.unregister('claude-code')).toBe(true);
    expect(registry.get('claude-code')).toBeUndefined();
  });

  it('unregister returns false for unknown agent', () => {
    const registry = new AdapterRegistry();
    expect(registry.unregister('codex')).toBe(false);
  });

  it('allows re-registration after unregister', () => {
    const registry = new AdapterRegistry();
    const adapter1 = createStubAdapter('claude-code');
    const adapter2 = createStubAdapter('claude-code');
    registry.register(adapter1);
    registry.unregister('claude-code');
    registry.register(adapter2);
    expect(registry.get('claude-code')).toBe(adapter2);
  });
});
