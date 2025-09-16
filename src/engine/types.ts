// GDD Section 8.1: Data Structures
// Centralized type definitions for the entire game engine.

export interface Material {
    id: string;
    name: string;
    description: string;
    tags: string[];
}

export interface BlueprintSlot {
    id: string;
    name: string;
    allowedTags: string[];
}

export interface SpriteLayer {
    id: string;
    spriteId: string;
    color: number; // Hex color
    emissive?: boolean;
}

export interface Blueprint {
    id:string;
    name: string;
    description: string;
    slots: BlueprintSlot[];
    baseStats: Record<string, any>;
    baseSpriteLayers: SpriteLayer[];
}

export interface SynthesizedItem {
    id: string;
    blueprintId: string;
    blueprintName: string;
    materials: Record<string, string>; // slotId -> materialId
    finalStats: Record<string, any>;
    visualLayers: SpriteLayer[];
}

export interface DilemmaChoice {
    text: string;
    // Add effect properties if needed later
}

export interface Dilemma {
    title: string;
    description: string;
    choices: DilemmaChoice[];
}

export interface Pawn {
    id: string;
    name: string;
    hp: number;
    maxHp: number;
    status: 'idle' | 'working' | 'injured';
    // Position on the map
    x: number;
    y: number;
}
