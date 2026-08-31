import { defineCapability } from "@senda/core";
import { z } from "zod";

import type { EngineeringDependencies } from "../application/ports.js";
import { domainFailure, requirePrincipal } from "../domain/errors.js";
import { prepareBrief } from "../domain/policy.js";

const input = z.object({
  ticketId: z.string().trim().min(1),
});

const output = z.object({
  ticketId: z.string(),
  objective: z.string(),
  affectedModules: z.array(z.string()),
  architectureNotes: z.array(z.string()),
  acceptanceCriteria: z.array(z.string()),
  risks: z.array(z.string()),
  testStrategy: z.string(),
});

export function createPrepareImplementation({ store }: EngineeringDependencies) {
  return defineCapability({
    title: "Prepare implementation",
    description:
      "Transforma um ticket em brief pronto para implementar, com módulos, ADRs, riscos e estratégia de teste.",
    input,
    output,
    access: "authenticated",
    timeoutMs: 15_000,
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
      const [modules, rules] = await Promise.all([
        store.listModules({ signal: context.signal }),
        store.listRules({ signal: context.signal }),
      ]);
      const brief = prepareBrief({ ticket, modules, rules });
      return {
        ticketId: brief.ticketId,
        objective: brief.objective,
        affectedModules: Array.from(brief.affectedModules),
        architectureNotes: Array.from(brief.architectureNotes),
        acceptanceCriteria: Array.from(brief.acceptanceCriteria),
        risks: Array.from(brief.risks),
        testStrategy: brief.testStrategy,
      };
    },
  });
}
