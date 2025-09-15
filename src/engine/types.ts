// GDD BASE System: Part I - Data Structures
// GDD DNE System: Data Structures

/**
 * Represents a single visual layer for a synthesized item.
 * Corresponds to a sprite or a visual effect.
 */
export interface SpriteLayer {
    id: string;          // e.g., 'body', 'barrel', 'glow'
    spriteId: string;    // Reference to an asset
    color: number;       // Hex color code, e.g., 0xFF0000 for red
    emissive?: boolean;  // Whether the layer glows
}

/**
 * Represents a raw material that can be used in synthesis.
 */
export interface Material {
    id: string;          // e.g., 'mat_ironwood'
    name: string;        // e.g., 'Ironwood'
    description: string;
    tags: string[];      // e.g., ['Wood', 'Durable', 'Heavy'] - for rule matching
}

/**
 * Defines a slot within a blueprint where a material can be placed.
 */
export interface BlueprintSlot {
    id: string;                     // e.g., 'slot_body'
    name: string;                   // e.g., 'Main Body'
    allowedTags: string[];          // Which material tags are allowed, e.g., ['Metal', 'Wood']
}

/**
 * The template for creating a new item.
 */
export interface Blueprint {
    id: string;                     // e.g., 'bp_rifle'
    name: string;                   // e.g., 'Assault Rifle'
    description: string;
    slots: BlueprintSlot[];
    baseStats: Record<string, any>; // e.g., { damage: 10, fireRate: 5 }
    baseSpriteLayers: SpriteLayer[];
}

/**
 * A final, crafted item with all properties calculated.
 */
export interface SynthesizedItem {
    id: string;
    blueprintId: string;
    blueprintName: string;
    materials: Record<string, string>; // Map of slotId -> materialId
    finalStats: Record<string, any>;
    visualLayers: SpriteLayer[];
}


// GDD DNE System Types
// These types are for the Dilemma & Narrative Engine.

/**
 * Represents a choice a player can make in a dilemma.
 */
export interface DilemmaChoice {
    text: string;           // The text displayed to the player, e.g., "Share the power."
    consequence: string;    // A key used to trigger the outcome of this choice.
}

/**
 * Represents a narrative event or decision point presented to the player.
 */
export interface Dilemma {
    id: string;
    title: string;
    description: string;
    choices: DilemmaChoice[];
}

/**
 * Represents the game's overall state, resources, pawn count etc.
 * Used for the Zustand store.
 */
export interface GameState {
    // Game loop state
    isPaused: boolean;
    timeScale: number;
    // Core resources
    resources: {
        power: number;
        biomass: number;
        alloys: number;
        components: number;
    };
    pawnCount: number;
    // DNE state
    currentDilemma: Dilemma | null;
    isLegacyScreenOpen: boolean;
    // FIX: Add isGeneratorToolOpen to the GameState interface to match the store's implementation.
    isGeneratorToolOpen: boolean;
    // BASE system state (crafting)
    blueprints: Blueprint[];
    materials: Material[];
    inventory: SynthesizedItem[];
}

/**
 * Actions that can be performed to mutate the game state.
 */
export interface GameActions {
    // Game loop actions
    togglePause: () => void;
    setTimeScale: (scale: number) => void;
    // DNE actions
    presentDilemma: (dilemma: Dilemma) => void;
    resolveDilemma: (choice: DilemmaChoice) => void;
    toggleLegacyScreen: () => void;
    // FIX: Add toggleGeneratorTool to the GameActions interface to match the store's implementation.
    toggleGeneratorTool: () => void;
    // BASE system actions
    // FIX: Update craftItem return type to match the implementation in the store, which can return the crafted item or null.
    craftItem: (blueprintId: string, selectedMaterials: Record<string, string>) => SynthesizedItem | null;
}
