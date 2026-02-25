// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

import { describe, it, expect } from 'vitest';
import { generateSessionId, createEvent, isAgentEvent } from '../events.js';

describe('generateSessionId', () => {
  it('returns a string', () => {
    expect(typeof generateSessionId()).toBe('string');
  });

  it('returns unique values', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateSessionId()));
    expect(ids.size).toBe(100);
  });
});

describe('createEvent', () => {
  it('creates an event with correct fields', () => {
    const before = Date.now();
    const event = createEvent('text', 'claude-code', { content: 'hello' }, 'sid-1');
    const after = Date.now();

    expect(event.type).toBe('text');
    expect(event.agent).toBe('claude-code');
    expect(event.payload).toEqual({ content: 'hello' });
    expect(event.sessionId).toBe('sid-1');
    expect(event.timestamp).toBeGreaterThanOrEqual(before);
    expect(event.timestamp).toBeLessThanOrEqual(after);
  });

  it('generates sessionId when not provided', () => {
    const event = createEvent('init', 'codex', {
      model: 'gpt-4',
      cwd: '/tmp',
      tools: [],
    });
    expect(typeof event.sessionId).toBe('string');
    expect(event.sessionId.length).toBeGreaterThan(0);
  });

  it('creates namespaced extension events', () => {
    const event = createEvent('codex:file_change', 'codex', { path: '/foo' });
    expect(event.type).toBe('codex:file_change');
    expect(event.payload).toEqual({ path: '/foo' });
  });
});

describe('isAgentEvent', () => {
  it('returns true for valid agent events', () => {
    const event = createEvent('text', 'claude-code', { content: 'hi' });
    expect(isAgentEvent(event)).toBe(true);
  });

  it('returns false for null', () => {
    expect(isAgentEvent(null)).toBe(false);
  });

  it('returns false for non-objects', () => {
    expect(isAgentEvent('string')).toBe(false);
    expect(isAgentEvent(42)).toBe(false);
    expect(isAgentEvent(undefined)).toBe(false);
  });

  it('returns false for objects missing required fields', () => {
    expect(isAgentEvent({ type: 'text' })).toBe(false);
    expect(isAgentEvent({ type: 'text', agent: 'x', timestamp: 1 })).toBe(false);
    expect(
      isAgentEvent({ type: 'text', agent: 'x', timestamp: 1, sessionId: 's' }),
    ).toBe(false);
  });

  it('returns true for objects with all required fields', () => {
    expect(
      isAgentEvent({
        type: 'text',
        agent: 'claude-code',
        timestamp: Date.now(),
        sessionId: 'sid',
        payload: { content: 'hello' },
      }),
    ).toBe(true);
  });
});
