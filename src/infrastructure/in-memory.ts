import type { ArchitectureRule, RepoModule, Ticket } from "../domain/types.js";
import type { EngineeringStore } from "../application/ports.js";

const tickets: readonly Ticket[] = [
  {
    id: "ENG-12",
    title: "Add refund reason to the order API",
    intent: "Expose refund reason on the billing module without changing checkout.",
    status: "ready",
    hasTests: false,
    hasAcceptanceEvidence: false,
  },
  {
    id: "ENG-13",
    title: "Ship the refund reason field",
    intent: "billing refund reason is live",
    status: "done",
    hasTests: true,
    hasAcceptanceEvidence: true,
  },
  {
    id: "ENG-09",
    title: "Blocked migration",
    intent: "Move billing off the monolith",
    status: "blocked",
    hasTests: false,
    hasAcceptanceEvidence: false,
  },
];

const modules: readonly RepoModule[] = [
  {
    name: "billing",
    path: "src/billing",
    responsibility: "Orders, invoices, and refunds",
  },
  {
    name: "checkout",
    path: "src/checkout",
    responsibility: "Cart and payment capture",
  },
];

const rules: readonly ArchitectureRule[] = [
  {
    id: "ADR-4",
    summary: "Domain policy stays behind an Action Engine, not in the agent prompt.",
  },
  {
    id: "ADR-7",
    summary: "Billing may read checkout identifiers but must not import checkout internals.",
  },
];

export function createInMemoryEngineeringStore(): EngineeringStore {
  const ticketMap = new Map(tickets.map((item) => [item.id, item]));
  return {
    async getTicket(id, { signal }) {
      signal.throwIfAborted();
      return ticketMap.get(id) ?? null;
    },
    async listModules({ signal }) {
      signal.throwIfAborted();
      return modules;
    },
    async listRules({ signal }) {
      signal.throwIfAborted();
      return rules;
    },
  };
}
