import { Dilemma } from './types';
import { useGameStore } from './store';

// GDD DNE System: The Dynamic Narrative Engine
// "Generates emergent story events (dilemmas) based on game state."

type GameStateSnapshot = ReturnType<typeof useGameStore.getState>;

// A simple library of dilemma templates.
const DILEMMA_TEMPLATES: ((state: GameStateSnapshot) => Dilemma | null)[] = [
    (state) => {
        if (state.materials.length > 5) {
            return {
                id: 'dilemma_resource_surplus',
                title: 'Unexpected Surplus',
                description: 'Our sensors detect a large, unstable cache of raw materials nearby. We could harvest it for a massive boost, but the energy signature is volatile and could damage our equipment.',
                choices: [
                    { text: 'Risk it for the materials.' },
                    { text: 'Play it safe and ignore the cache.' },
                ],
            };
        }
        return null;
    },
    (state) => {
        if (state.inventory.length > 2) {
            return {
                id: 'dilemma_strange_signal',
                title: 'A Strange Signal',
                description: 'A faint, repeating signal has been detected. It doesn\'t match any known friendly patterns. It could be a distress call, a trap, or just static.',
                choices: [
                    { text: 'Investigate the source of the signal.' },
                    { text: 'Jam the signal and focus on our mission.' },
                ],
            };
        }
        return null;
    },
];


export const generateDilemma = (state: GameStateSnapshot): Dilemma | null => {
    // In a real DNE, this would be a complex system of triggers and conditions.
    // For now, we'll just randomly pick a valid one.
    
    const possibleDilemmas = DILEMMA_TEMPLATES
        .map(template => template(state))
        .filter((d): d is Dilemma => d !== null);

    if (possibleDilemmas.length === 0) {
        return null;
    }
    
    const randomIndex = Math.floor(Math.random() * possibleDilemmas.length);
    return possibleDilemmas[randomIndex];
};
