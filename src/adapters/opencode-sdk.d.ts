// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

declare module '@opencode-ai/sdk' {
  export function createClient(options?: unknown): unknown;
  export class OpenCode {
    constructor(options?: unknown);
  }
  export class OpenCodeClient {
    constructor(options?: unknown);
  }
}
