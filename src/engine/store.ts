import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Blueprint, Material, SynthesizedItem, Dilemma, DilemmaChoice, Pawn } from './types';
import { INITIAL_BLUEPRINTS, INITIAL_MATERIALS } from './data';
import { synthesizeItem } from './baseEngine';
import { eventBus } from './eventBus';
import { generateDilemma } from './dneEngine';
import { updatePawns, PAWNS } from './pawnEngine';

// GDD Section 8.2: Centralized State Management (Zustand)
// "All global game state will be managed by a central store..."
// Refactored to use Immer for safe, immutable state updates.

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
}

interface GameActions {
    togglePause: () => void;
    setTimeScale: (scale: number) => void;
    gameTick: (delta: number) => void;

    toggleLegacyScreen: () => void;
    toggleGeneratorTool: () => void;

    craftItem: (blueprintId: string, selectedMaterials: Record<string, string>) => SynthesizedItem | null;
    
    resolveDilemma: (choice: DilemmaChoice) => void;
    triggerDilemma: () => void;
}

export const useGameStore = create<GameState & { actions: GameActions }>()(
    immer((set, get) => ({
        // --- STATE ---
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

        // --- ACTIONS ---
        actions: {
            togglePause: () => set(state => {
                state.isPaused = !state.isPaused;
            }),

            setTimeScale: (scale) => set(state => {
                state.timeScale = scale;
                state.isPaused = false;
            }),

            gameTick: (delta) => {
                if (get().isPaused) return;

                const effectiveDelta = delta * get().timeScale;
                
                set(state => {
                    // Update pawns using the dedicated pawn engine logic
                    state.pawns = updatePawns(state.pawns, effectiveDelta);
                    state.gameTime += effectiveDelta;
                });
                
                // Occasionally trigger a dilemma based on elapsed time (approx. 1% chance per second).
                if (Math.random() < 0.01 * effectiveDelta) {
                    get().actions.triggerDilemma();
                }
            },

            toggleLegacyScreen: () => set(state => {
                state.showLegacyScreen = !state.showLegacyScreen;
            }),

            toggleGeneratorTool: () => set(state => {
                state.showGeneratorTool = !state.showGeneratorTool;
            }),

            craftItem: (blueprintId, selectedMaterials) => {
                const { blueprints, materials } = get();
                const blueprint = blueprints.find(bp => bp.id === blueprintId);
                if (!blueprint) {
                    console.error("Blueprint not found for crafting");
                    return null;
                }

                const newItem = synthesizeItem(blueprint, selectedMaterials, materials);
                if (newItem) {
                    set(state => {
                        state.inventory.push(newItem);
                    });
                    eventBus.emit('blueprint:discovered', { name: newItem.blueprintName });
                }
                return newItem;
            },
            
            resolveDilemma: (choice) => {
                console.log(`Dilemma resolved with choice: ${choice.text}`);
                set(state => {
                    state.activeDilemma = null;
                });
            },

            triggerDilemma: () => {
                // Do not trigger a new dilemma if one is already active
                if (get().activeDilemma) return;

                const newDilemma = generateDilemma(get());
                if (newDilemma) {
                    set(state => {
                        state.activeDilemma = newDilemma;
                        state.isPaused = true; // Pause the game when a dilemma appears
                    });
                }
            },
        }
    }))
);
