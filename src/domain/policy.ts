import type {
  ArchitectureRule,
  ImplementationBrief,
  ReadinessResult,
  RepoModule,
  Ticket,
} from "./types.js";

export const engineeringPolicy = Object.freeze({
  team: "Norte Labs",
  requiredAcceptancePhrases: ["given", "then"],
});

export function prepareBrief(args: {
  readonly ticket: Ticket;
  readonly modules: readonly RepoModule[];
  readonly rules: readonly ArchitectureRule[];
}): ImplementationBrief {
  const affected = args.modules.filter((module) =>
    moduleIsInScope(args.ticket.intent, module.name),
  );
  const chosen = affected.length > 0 ? affected : args.modules.slice(0, 1);

  return {
    ticketId: args.ticket.id,
    objective: args.ticket.title,
    affectedModules: chosen.map((module) => module.path),
    architectureNotes: args.rules.map((rule) => `${rule.id}: ${rule.summary}`),
    acceptanceCriteria: [
      `Given the current ${args.ticket.id} scope, the change is isolated to ${chosen.map((module) => module.name).join(", ")}.`,
      "Then automated tests cover the success path and the documented failure.",
    ],
    risks: [
      affected.length === 0
        ? "Intent did not name a module; the brief defaulted to the first bounded context."
        : "Cross-module contracts may still need an explicit owner.",
    ],
    testStrategy:
      "Add a failing engine-level test for the new behavior, then cover the failure contract before marking the ticket done.",
  };
}

function moduleIsInScope(intent: string, name: string): boolean {
  const text = intent.toLowerCase();
  const token = name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!new RegExp(`\\b${token}\\b`).test(text)) return false;
  return !new RegExp(
    `\\b(?:without changing|without touching|except)\\s+${token}\\b`,
  ).test(text);
}

export function assessReadiness(ticket: Ticket): ReadinessResult {
  const blockers: string[] = [];
  if (ticket.status === "blocked") blockers.push("Ticket is marked blocked.");
  if (!ticket.hasTests) blockers.push("Automated tests are missing.");
  if (!ticket.hasAcceptanceEvidence) {
    blockers.push("Acceptance evidence is missing.");
  }
  return {
    ticketId: ticket.id,
    ready: blockers.length === 0,
    blockers,
  };
}
