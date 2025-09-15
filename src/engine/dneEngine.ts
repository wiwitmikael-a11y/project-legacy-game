
import { useGameStore } from './store';
import { Dilemma } from './types';

// GDD DNE System: The Dilemma & Narrative Engine
// This engine is responsible for triggering narrative events based on game state.

const DILEMMAS: Dilemma[] = [
    {
        id: 'dilemma_01',
        title: 'Power Surge',
        description: 'A nearby geothermal vent has become active, offering a massive, but potentially unstable, source of power. Tapping it could supercharge our colony, but a miscalculation might cause a catastrophic overload.',
        choices: [
            { text: 'Tap the vent carefully.', consequence: 'gain_power_risk' },
            { text: 'Ignore it, it\'s too dangerous.', consequence: 'no_change' },
        ],
    },
    {
        id: 'dilemma_02',
        title: 'Strange Signal',
        description: 'A weak, repeating signal is detected from a crashed satellite just beyond our perimeter. It could be a distress call, a data cache, or a trap. Sending a pawn to investigate will be risky.',
        choices: [
            { text: 'Send a pawn to investigate.', consequence: 'investigate_signal' },
            { text: 'Destroy the satellite from a distance.', consequence: 'destroy_signal' },
            { text: 'Leave it alone.', consequence: 'no_change' },
        ],
    },
];

let lastDilemmaTime = Date.now();
const DILEMMA_COOLDOWN = 15000; // 15 seconds for easier testing

/**
 * The main update loop for the DNE system.
 * This should be called periodically by the main game loop's ticker.
 */
export const tickDneEngine = () => {
    // Get non-reactive state to avoid subscribing the game loop to store changes
    const { pawnCount, currentDilemma, actions } = useGameStore.getState();

    // Don't trigger a new dilemma if one is already active or we're on cooldown
    if (currentDilemma || Date.now() - lastDilemmaTime < DILEMMA_COOLDOWN) {
        return;
    }

    // Example Trigger: Trigger a random dilemma periodically if pawn count is sufficient
    if (pawnCount >= 5) {
        const dilemma = DILEMMAS[Math.floor(Math.random() * DILEMMAS.length)];
        if (dilemma) {
            actions.presentDilemma(dilemma);
            lastDilemmaTime = Date.now();
        }
    }
};
