# Port Type Rules

This file clarifies how Codex should interpret special port types in `specs/node-catalog.v0.json`.

## Concrete resource types

Concrete resources are values that can exist in game state balances, rates, buffers, or persisted edges.

Examples:

- money
- rawData
- parsedData
- cleanData
- compute
- research
- power
- heat
- gpu
- bandwidth
- storage
- reputation
- trust
- trace
- byteCoin
- hashLite

## Special port types

Some node definitions use special port types to mean “match one of several concrete resources.”

### anyData

Matches:

- rawData
- parsedData
- cleanData

### anyCoin

Matches:

- byteCoin
- hashLite

## Implementation rule

Special port types may appear in node definitions, but persisted edges must store the resolved concrete resource type.

Example:

If a router with `anyData` connects to a cleanData output, the saved edge resource type must be `cleanData`, not `anyData`.

## M1 rule

M1 should ignore special port types unless needed. The first milestone should focus only on:

- money
- rawData
- parsedData
- cleanData
- compute
- research
