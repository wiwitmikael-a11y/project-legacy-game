import { Blueprint, BlueprintSlot, Material, SpriteLayer } from './types';

// GDD BASE System: Part II - Rule-Based Material Effects
// This library contains the logic for how materials modify blueprints.

// Helper function to find a layer by its ID
const getLayer = (layers: SpriteLayer[], id: string): SpriteLayer | undefined => {
    return layers.find(l => l.id === id);
}

/**
 * Modifies the stats and visual layers of an item based on the material applied to a slot.
 * This is where the core crafting logic resides.
 * @param stats The base stats object (will be mutated).
 * @param layers The base visual layers array (will be mutated).
 * @param blueprint The blueprint being used.
 * @param slot The slot the material is being applied to.
 * @param material The material being applied.
 */
export const applyRules = (
    stats: Record<string, any>,
    layers: SpriteLayer[],
    blueprint: Blueprint,
    slot: BlueprintSlot,
    material: Material
): void => {
    // --- GENERAL RULES based on material tags ---

    if (material.tags.includes('Durable')) {
        stats.durability = (stats.durability || 100) + 20;
        stats.weight = (stats.weight || 0) + 5;
    }
    if (material.tags.includes('Lightweight')) {
        stats.weight = (stats.weight || 10) - 5;
    }
    if (material.tags.includes('Energy_Focus')) {
        stats.energyCapacity = (stats.energyCapacity || 0) + 50;
        stats.damage = (stats.damage || 0) + 5;
        if (stats.damageType) stats.damageType = 'Energy';
    }
    if (material.tags.includes('Bioluminescent')) {
        // Make the primary layer glow
        if (layers[0]) {
            layers[0].emissive = true;
        }
    }

    // --- SPECIFIC RULES based on blueprint, slot, and material ---

    // Example: Rifle crafting
    if (blueprint.id === 'bp_rifle') {
        const bodyLayer = getLayer(layers, 'body');
        
        if (slot.id === 'slot_body') {
            if (material.id === 'mat_ironwood') {
                stats.damage = (stats.damage || 10) + 2; // Heavier wood, more impact
                stats.weight += 3;
                if (bodyLayer) bodyLayer.color = 0x6B4226; // Brown wood color
            }
            if (material.id === 'mat_titanium') {
                stats.fireRate = (stats.fireRate || 5) * 1.2; // Lighter frame, faster handling
                stats.weight -= 2;
                if (bodyLayer) bodyLayer.color = 0x888888; // Default metal color
            }
        }
        if (slot.id === 'slot_core') {
            if (material.id === 'mat_crystal') {
                stats.damageType = 'Plasma';
                stats.damage *= 1.5;
                stats.fireRate *= 0.8;
                const barrelLayer = getLayer(layers, 'barrel');
                if (barrelLayer) {
                    barrelLayer.color = 0x00FFFF; // Cyan plasma color
                    barrelLayer.emissive = true;
                }
            }
        }
    }

    // Example: Armor crafting
    if (blueprint.id === 'bp_armor') {
        const vestLayer = getLayer(layers, 'vest');

        if (slot.id === 'slot_plating') {
            if (material.id === 'mat_chitin') {
                stats.defense = (stats.defense || 20) * 0.9; // Lighter but less protective
                stats.mobility = (stats.mobility || -5) + 5;
                if (vestLayer) vestLayer.color = 0x8B4513; // Chitin brown
            }
        }
         if (slot.id === 'slot_core') {
             if (material.id === 'mat_crystal') {
                stats.energyShield = 50;
                stats.defense += 5;
                if (vestLayer) vestLayer.emissive = true; // Add a glow to the armor
            }
        }
    }
};
