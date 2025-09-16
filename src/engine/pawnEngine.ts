import { Pawn } from './types';

// GDD Section 10: Pawns & AI
// Initial pawn data and logic for updating their state over time.

export const PAWNS: Pawn[] = [
    {
        id: 'pawn_01',
        name: 'Jax',
        hp: 100,
        maxHp: 100,
        status: 'idle',
        x: 100,
        y: 150,
    },
    {
        id: 'pawn_02',
        name: 'Kael',
        hp: 85,
        maxHp: 100,
        status: 'working',
        x: 250,
        y: 200,
    },
];

/**
 * Updates the state of all pawns for a given time delta.
 * @param pawns The current array of pawns.
 * @param delta The time elapsed since the last update, in seconds.
 * @returns The new array of pawns with updated states.
 */
export const updatePawns = (pawns: Pawn[], delta: number): Pawn[] => {
    // This is a deep copy to ensure we don't mutate the original state directly,
    // which is good practice, especially with state management libraries like Zustand.
    const newPawns = JSON.parse(JSON.stringify(pawns));

    for (const pawn of newPawns) {
        // Simple example logic:
        // - Pawns slowly heal if injured and idle.
        // - Pawns move around randomly if idle.

        if (pawn.status === 'injured' && pawn.hp < pawn.maxHp) {
            pawn.hp = Math.min(pawn.maxHp, pawn.hp + 1 * delta); // Heal 1 HP per second
        }

        if (pawn.status === 'idle') {
            // Simple random walk
            pawn.x += (Math.random() - 0.5) * 10 * delta; // Move up to 5 pixels per second
            pawn.y += (Math.random() - 0.5) * 10 * delta;
        }

        // Add more complex AI logic here in the future...
    }

    return newPawns;
};
