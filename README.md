# engineering-engine

Action Engine de implementação da **Norte Labs**.

O agente não reconstrói o processo de planejamento. O ticket vira um brief com módulos, ADRs, riscos e testes.

| Capability | Resultado |
|---|---|
| `engineering.prepare-implementation` | Brief pronto para implementar |
| `engineering.assess-task-readiness` | Gate de pronto (testes + evidência) |

Tickets de demonstração: `ENG-12` (precisa de testes) e `ENG-13` (pronto).

```sh
npm install
npm run check
npm run direct
```

MIT
