export const ticketStatuses = ["ready", "blocked", "done"] as const;

export type TicketStatus = (typeof ticketStatuses)[number];

export interface Ticket {
  readonly id: string;
  readonly title: string;
  readonly intent: string;
  readonly status: TicketStatus;
  readonly hasTests: boolean;
  readonly hasAcceptanceEvidence: boolean;
}

export interface ArchitectureRule {
  readonly id: string;
  readonly summary: string;
}

export interface RepoModule {
  readonly name: string;
  readonly path: string;
  readonly responsibility: string;
}

export interface ImplementationBrief {
  readonly ticketId: string;
  readonly objective: string;
  readonly affectedModules: readonly string[];
  readonly architectureNotes: readonly string[];
  readonly acceptanceCriteria: readonly string[];
  readonly risks: readonly string[];
  readonly testStrategy: string;
}

export interface ReadinessResult {
  readonly ticketId: string;
  readonly ready: boolean;
  readonly blockers: readonly string[];
}
