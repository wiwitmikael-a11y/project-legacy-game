// GDD Section BASE System: Data structures for crafting.
// GDD Section DNE System: Data structure for dilemmas.
// GDD Section Pawns: Data structure for characters.

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
    color: number;
    emissive?: boolean;
}

export interface Blueprint {
    id: string;
    name: string;
    description: string;
    slots: BlueprintSlot[];
    baseStats: Record<string, string | number>;
    baseSpriteLayers: SpriteLayer[];
}

export interface SynthesizedItem {
    id: string;
    blueprintId: string;
    blueprintName: string;
    materials: Record<string, string>; // slotId -> materialId
    finalStats: Record<string, string | number>;
    visualLayers: SpriteLayer[];
}


export interface DilemmaChoice {
    text: string;
    // Potentially add effect callbacks or identifiers here
}

export interface Dilemma {
    id: string;
    title: string;
    description: string;
    choices: DilemmaChoice[];
}

export interface Pawn {
    id: string;
    name: string;
    status: 'Idle' | 'Working' | 'Injured' | 'Dead';
}
