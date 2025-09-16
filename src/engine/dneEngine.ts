import { Dilemma } from './types';

// GDD DNE System: Dynamic Narrative Engine
// This engine is responsible for generating narrative events (dilemmas).

/**
 * Generates a new dilemma for the player based on the current game state.
 * @param gameState The current state of the game.
 * @returns A Dilemma object or null if no dilemma is triggered.
 */
export const generateDilemma = (gameState: any): Dilemma | null => {
    // In a real implementation, this would be a complex system that analyzes the
    // game state (e.g., low resources, recent events) to generate a relevant dilemma.
    // For now, we'll return a simple, hardcoded dilemma.

    // Example logic: if the player has crafted items, present a dilemma.
    if (gameState.inventory.length > 0 && Math.random() > 0.5) {
        return {
            title: 'Unexpected Surplus',
            description: 'Your recent crafting successes have produced more than you need. A nearby settlement has offered to trade for your surplus. Do you accept?',
            choices: [
                { text: 'Trade for rare materials.' },
                { text: 'Keep the items for emergencies.' },
            ],
        };
    }

    // Another example.
    if (Math.random() > 0.7) {
        return {
            title: 'Power Fluctuation',
            description: 'A sudden power surge has been detected. You can try to harness the extra energy, but it risks damaging your equipment.',
            choices: [
                { text: 'Risk it for the extra power.' },
                { text: 'Play it safe and shut down non-essential systems.' },
            ],
        };
    }
    
    return null; // No dilemma triggered
};
