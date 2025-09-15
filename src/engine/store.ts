import { create } from 'zustand';
import { Blueprint, Material, SynthesizedItem, Dilemma, DilemmaChoice, Pawn } from './types';
import { INITIAL_BLUEPRINTS, INITIAL_MATERIALS } from './data';
import { synthesizeItem } from './baseEngine';
import { eventBus } from './eventBus';
import { generateDilemma } from './dneEngine';
import { updatePawns, PAWNS } from './pawnEngine';

// GDD Section 8.2: Centralized State Management (Zustand)
// "All global game state will be managed by a central store..."

interface GameState {
    // Game Time & Control
    isPaused: boolean;
    timeScale: number;
    gameTime: number;

    // Resources & Crafting
    materials: Material[];
    inventory: SynthesizedItem[];
    blueprints: Blueprint[];
    
    // UI State
    showLegacyScreen: boolean;
    showGeneratorTool: boolean;

    // DNE System
    activeDilemma: Dilemma | null;
    
    // Pawns
    pawns: Pawn[];

    // Actions
    actions: {
        togglePause: () => void;
        setTimeScale: (scale: number) => void;
        gameTick: (delta: number) => void;

        toggleLegacyScreen: () => void;
        toggleGeneratorTool: () => void;

        craftItem: (blueprintId: string, selectedMaterials: Record<string, string>) => SynthesizedItem | null;
        
        resolveDilemma: (choice: DilemmaChoice) => void;
        triggerDilemma: () => void;
    };
}

export const useGameStore = create<GameState>((set, get) => ({
    isPaused: true,
    timeScale: 1,
    gameTime: 0,
    materials: INITIAL_MATERIALS,
    inventory: [],
    blueprints: INITIAL_BLUEPRINTS,
    showLegacyScreen: false,
    showGeneratorTool: false,
    activeDilemma: null,
    pawns: PAWNS,

    actions: {
        togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
        setTimeScale: (scale) => set({ timeScale: scale, isPaused: false }),
        gameTick: (delta) => {
            const { isPaused, timeScale, pawns, gameTime } = get();
            if (isPaused) return;

            const effectiveDelta = delta * timeScale;
            
            // Update pawns
            const updatedPawns = updatePawns(pawns, effectiveDelta);

            // Occasionally trigger a dilemma
            if (Math.random() < 0.001) {
                get().actions.triggerDilemma();
            }

            set({ gameTime: gameTime + effectiveDelta, pawns: updatedPawns });
        },

        toggleLegacyScreen: () => set((state) => ({ showLegacyScreen: !state.showLegacyScreen })),
        toggleGeneratorTool: () => set((state) => ({ showGeneratorTool: !state.showGeneratorTool })),

        craftItem: (blueprintId, selectedMaterials) => {
            const { blueprints, materials } = get();
            const blueprint = blueprints.find(bp => bp.id === blueprintId);
            if (!blueprint) {
                console.error("Blueprint not found for crafting");
                return null;
            }

            const newItem = synthesizeItem(blueprint, selectedMaterials, materials);
            if (newItem) {
                set(state => ({ inventory: [...state.inventory, newItem] }));
                eventBus.emit('blueprint:discovered', { name: newItem.blueprintName }); // Example event
            }
            return newItem;
        },
        
        resolveDilemma: (choice) => {
            console.log(`Dilemma resolved with choice: ${choice.text}`);
            // In a real game, the choice would have consequences.
            set({ activeDilemma: null });
        },

        triggerDilemma: () => {
            if (get().activeDilemma) return; // Don't show a new one if one is active
            const newDilemma = generateDilemma(get());
            if (newDilemma) {
                set({ activeDilemma: newDilemma, isPaused: true });
            }
        },
    }
}));
