import { Blueprint, Material, SynthesizedItem, SpriteLayer, BlueprintSlot } from './types';
import { applyRules } from './ruleLibrary';

// GDD BASE System: Part III - The Synthesis Engine
// This is the core logic for combining blueprints and materials.

/**
 * Creates a new item by combining a blueprint with selected materials.
 * It calculates the final stats and visual properties based on the rule library.
 * @param blueprint The blueprint to use.
 * @param selectedMaterials A map of slotId -> materialId.
 * @param allMaterials The complete list of available materials.
 * @returns A new SynthesizedItem, or null if crafting fails.
 */
export const synthesizeItem = (
    blueprint: Blueprint,
    selectedMaterials: Record<string, string>,
    allMaterials: Material[]
): SynthesizedItem | null => {
    // 1. Validate that all slots are filled
    for (const slot of blueprint.slots) {
        if (!selectedMaterials[slot.id]) {
            console.error(`Missing material for slot: ${slot.name}`);
            return null;
        }
    }

    // 2. Start with base stats and visuals (deep copy to avoid mutation of original data)
    const finalStats = JSON.parse(JSON.stringify(blueprint.baseStats));
    const visualLayers: SpriteLayer[] = JSON.parse(JSON.stringify(blueprint.baseSpriteLayers));

    // 3. Apply rules for each material in each slot
    for (const slot of blueprint.slots) {
        const materialId = selectedMaterials[slot.id];
        const material = allMaterials.find(m => m.id === materialId);
        
        if (!material) {
            console.error(`Material with id ${materialId} not found.`);
            return null;
        }

        // Apply stat and visual modifications from the rule library
        applyRules(finalStats, visualLayers, blueprint, slot, material);
    }
    
    // 4. Create the final item object
    const newItem: SynthesizedItem = {
        id: `item_${Date.now()}_${Math.random()}`, // Simple unique ID
        blueprintId: blueprint.id,
        blueprintName: blueprint.name,
        materials: selectedMaterials,
        finalStats,
        visualLayers,
    };
    
    return newItem;
};
