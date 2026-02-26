// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

declare module '@openai/codex-sdk' {
  export class Codex {
    startThread(options?: unknown): unknown;
    resumeThread?(threadId: string, options?: unknown): unknown;
  }
}
