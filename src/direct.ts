import { engine, localPrincipal } from "./engine.js";

const result = await engine.invoke(
  "engineering.prepare-implementation",
  { ticketId: "ENG-12" },
  { source: "direct", principal: localPrincipal },
);

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
