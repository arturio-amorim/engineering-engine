import { describe, expect, it } from "vitest";

import {
  createDefaultEngineeringEngine,
  localPrincipal,
} from "../src/engine.js";

describe("engineering engine", () => {
  it("turns a ticket into an implementation brief", async () => {
    const engine = createDefaultEngineeringEngine();
    const brief = await engine.invoke(
      "engineering.prepare-implementation",
      { ticketId: "ENG-12" },
      { principal: localPrincipal },
    );
    expect(brief.ticketId).toBe("ENG-12");
    expect(brief.affectedModules).toEqual(["src/billing"]);
    expect(brief.affectedModules).not.toContain("src/checkout");
    expect(brief.architectureNotes.length).toBeGreaterThan(0);
    expect(brief.testStrategy.length).toBeGreaterThan(0);
  });

  it("blocks readiness when tests and evidence are missing", async () => {
    const engine = createDefaultEngineeringEngine();
    await expect(
      engine.invoke(
        "engineering.assess-task-readiness",
        { ticketId: "ENG-12" },
        { principal: localPrincipal },
      ),
    ).resolves.toMatchObject({ ready: false });
  });

  it("passes readiness when gates are present", async () => {
    const engine = createDefaultEngineeringEngine();
    await expect(
      engine.invoke(
        "engineering.assess-task-readiness",
        { ticketId: "ENG-13" },
        { principal: localPrincipal },
      ),
    ).resolves.toMatchObject({ ready: true, blockers: [] });
  });
});
