
// GDD Section 8.2: State Management - Zustand
// "A central, reactive state store should be used. Zustand is preferred for its simplicity."

import { create } from 'zustand';
import { GameState, GameActions, DilemmaChoice, SynthesizedItem } from './types';
import { INITIAL_BLUEPRINTS, INITIAL_MATERIALS } from './data';
import { synthesizeItem } from './baseEngine';

type StoreState = GameState & {
    actions: GameActions;
};

export const useGameStore = create<StoreState>((set, get) => ({
    // GDD Section 9.2: HUD -> Default Values
    // "Game should start with a baseline of resources."
    isPaused: false,
    timeScale: 1,
    resources: {
        power: 1000,
        biomass: 500,
        alloys: 250,
        components: 50,
    },
    pawnCount: 5,
    currentDilemma: null,
    isLegacyScreenOpen: false,
    isGeneratorToolOpen: false, // New state for dev tools

    // GDD BASE System: Initial crafting data
    blueprints: INITIAL_BLUEPRINTS,
    materials: INITIAL_MATERIALS,
    inventory: [],

    actions: {
        togglePause: () => set(state => ({ isPaused: !state.isPaused })),
        setTimeScale: (scale: number) => set({ timeScale: scale }),
        presentDilemma: (dilemma) => set({ currentDilemma: dilemma }),
        resolveDilemma: (choice: DilemmaChoice) => {
             // In a real game, the 'consequence' string would trigger another system.
             // For now, we just log it and close the modal.
            console.log(`Choice made: ${choice.text}, Consequence: ${choice.consequence}`);
            set({ currentDilemma: null });
        },
        toggleLegacyScreen: () => set(state => ({ isLegacyScreenOpen: !state.isLegacyScreenOpen })),
        toggleGeneratorTool: () => set(state => ({ isGeneratorToolOpen: !state.isGeneratorToolOpen })), // New action for dev tools
        
        craftItem: (blueprintId: string, selectedMaterials: Record<string, string>): SynthesizedItem | null => {
            const { blueprints, materials, inventory } = get();
            const blueprint = blueprints.find(bp => bp.id === blueprintId);

            if (!blueprint) {
                console.error(`Blueprint with id ${blueprintId} not found for crafting.`);
                return null;
            }

            // The core synthesis logic is in a separate, testable engine file.
            const newItem = synthesizeItem(blueprint, selectedMaterials, materials);

            if (newItem) {
                set({ inventory: [...inventory, newItem] });
                console.log('Crafted new item:', newItem);
                return newItem; // Return the new item on success
            } else {
                console.error('Crafting failed.');
                return null; // Return null on failure
            }
        },
    }
}));
