import { createEngine, type Principal } from "@senda/core";

import type { EngineeringDependencies } from "./application/ports.js";
import { createAssessTaskReadiness } from "./capabilities/assess-task-readiness.js";
import { createPrepareImplementation } from "./capabilities/prepare-implementation.js";
import { createInMemoryEngineeringStore } from "./infrastructure/in-memory.js";

export const localPrincipal: Principal = Object.freeze({
  id: "local:eng-desk",
});

export function createEngineeringEngine(dependencies: EngineeringDependencies) {
  return createEngine({
    name: "engineering-engine",
    version: "0.1.0",
    capabilities: {
      "engineering.prepare-implementation":
        createPrepareImplementation(dependencies),
      "engineering.assess-task-readiness": createAssessTaskReadiness(dependencies),
    },
  });
}

export function createDefaultEngineeringEngine(
  overrides: Partial<EngineeringDependencies> = {},
) {
  return createEngineeringEngine({
    store: overrides.store ?? createInMemoryEngineeringStore(),
  });
}

export const engine = createDefaultEngineeringEngine();
