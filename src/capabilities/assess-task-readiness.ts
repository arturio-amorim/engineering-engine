import { defineCapability } from "@invokta/core";
import { z } from "zod";

import type { EngineeringDependencies } from "../application/ports.js";
import { domainFailure, requirePrincipal } from "../domain/errors.js";
import { assessReadiness } from "../domain/policy.js";

const input = z.object({
  ticketId: z.string().trim().min(1),
});

const output = z.object({
  ticketId: z.string(),
  ready: z.boolean(),
  blockers: z.array(z.string()),
});

export function createAssessTaskReadiness({ store }: EngineeringDependencies) {
  return defineCapability({
    title: "Assess task readiness",
    description:
      "Aplica o gate de pronto: testes, evidência de aceite e status do ticket.",
    input,
    output,
    access: "authenticated",
    timeoutMs: 10_000,
    annotations: {
      readOnly: true,
      destructive: false,
      idempotent: true,
      openWorld: false,
    },
    async run({ input: request, context }) {
      requirePrincipal(context.principal);
      const ticket = await store.getTicket(request.ticketId, {
        signal: context.signal,
      });
      if (ticket === null) {
        throw domainFailure("Ticket not found.", { ticketId: request.ticketId });
      }
      const result = assessReadiness(ticket);
      return {
        ticketId: result.ticketId,
        ready: result.ready,
        blockers: Array.from(result.blockers),
      };
    },
  });
}
