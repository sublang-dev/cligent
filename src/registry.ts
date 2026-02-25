// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

import type { AgentType, AgentAdapter } from './types.js';

export class AdapterRegistry {
  private readonly adapters = new Map<AgentType, AgentAdapter>();

  register(adapter: AgentAdapter): void {
    if (this.adapters.has(adapter.agent)) {
      throw new Error(`Adapter already registered for agent: ${adapter.agent}`);
    }
    this.adapters.set(adapter.agent, adapter);
  }

  get(agent: AgentType): AgentAdapter | undefined {
    return this.adapters.get(agent);
  }

  list(): AgentType[] {
    return [...this.adapters.keys()];
  }

  unregister(agent: AgentType): boolean {
    return this.adapters.delete(agent);
  }
}
