import type { ResearchDefinition, ResearchId } from "../state/types";

export const researchDefinitions = [
  {
    id: "parser_optimization",
    title: "Parser Optimization",
    description: "Reduces Parser compute demand with tighter parse passes.",
    costResearch: 5,
    prerequisiteResearchIds: [],
    effectType: "node_compute_use_multiplier",
    effectValue: 0.8,
    targetNodeDefinitionId: "parser"
  },
  {
    id: "cooling_discipline",
    title: "Cooling Discipline",
    description: "Raises the safe heat envelope through better rack spacing.",
    costResearch: 4,
    prerequisiteResearchIds: [],
    effectType: "global_heat_capacity_add",
    effectValue: 2
  },
  {
    id: "cleaner_efficiency",
    title: "Cleaner Efficiency",
    description: "Reduces Cleaner heat output through cleaner batch handling.",
    costResearch: 6,
    prerequisiteResearchIds: ["parser_optimization"],
    effectType: "node_heat_output_multiplier",
    effectValue: 0.8,
    targetNodeDefinitionId: "cleaner"
  },
  {
    id: "power_routing",
    title: "Power Routing",
    description: "Adds a small effective power-capacity buffer to the facility.",
    costResearch: 6,
    prerequisiteResearchIds: ["cooling_discipline"],
    effectType: "global_power_capacity_add",
    effectValue: 3
  },
  {
    id: "upload_compression",
    title: "Upload Compression",
    description: "Improves Upload Gateway revenue from each clean-data batch.",
    costResearch: 8,
    prerequisiteResearchIds: ["parser_optimization"],
    effectType: "node_output_multiplier",
    effectValue: 1.15,
    targetNodeDefinitionId: "upload_gateway",
    targetResourceId: "money"
  }
] as const satisfies readonly ResearchDefinition[];

export const researchDefinitionsById = Object.freeze(
  Object.fromEntries(
    researchDefinitions.map((definition) => [definition.id, definition])
  ) as Record<ResearchId, ResearchDefinition>
);
