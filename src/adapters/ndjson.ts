// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

import type { Readable } from 'node:stream';

export type NDJSONParseResult =
  | { ok: true; data: unknown }
  | { ok: false; error: string; raw: string };

function chunkToString(chunk: unknown): string {
  if (typeof chunk === 'string') return chunk;
  if (Buffer.isBuffer(chunk)) return chunk.toString('utf8');
  if (chunk instanceof Uint8Array) return Buffer.from(chunk).toString('utf8');
  return String(chunk);
}

function parseLine(rawLine: string): NDJSONParseResult | undefined {
  const line = rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine;
  if (line.trim().length === 0) return undefined;

  try {
    return {
      ok: true,
      data: JSON.parse(line) as unknown,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : 'Failed to parse NDJSON line',
      raw: line,
    };
  }
}

export async function* parseNDJSON(
  stream: Readable,
): AsyncGenerator<NDJSONParseResult, void, void> {
  let buffer = '';

  for await (const chunk of stream) {
    buffer += chunkToString(chunk);

    while (true) {
      const newlineIndex = buffer.indexOf('\n');
      if (newlineIndex === -1) break;

      const line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);

      const parsed = parseLine(line);
      if (!parsed) continue;
      yield parsed;
    }
  }

  if (buffer.length > 0) {
    const parsed = parseLine(buffer);
    if (parsed) {
      yield parsed;
    }
  }
}
