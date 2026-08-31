import type { ArchitectureRule, RepoModule, Ticket } from "../domain/types.js";

export interface EngineeringStore {
  getTicket(
    ticketId: string,
    options: { readonly signal: AbortSignal },
  ): Promise<Ticket | null>;
  listModules(options: { readonly signal: AbortSignal }): Promise<readonly RepoModule[]>;
  listRules(options: { readonly signal: AbortSignal }): Promise<readonly ArchitectureRule[]>;
}

export interface EngineeringDependencies {
  readonly store: EngineeringStore;
}
