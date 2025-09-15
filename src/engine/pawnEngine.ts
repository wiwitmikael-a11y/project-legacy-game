import { Pawn } from './types';

// GDD Section Pawns: Autonomous Characters
// "Pawns (the colonists/crew) are the core of the simulation."

// Initial pawn data
export const PAWNS: Pawn[] = [
    { id: 'pawn_01', name: 'Jax', status: 'Idle' },
    { id: 'pawn_02', name: 'Kara', status: 'Idle' },
];

/**
 * Updates the state of all pawns for a given time delta.
 * This is the core logic loop for pawn AI and behavior.
 * @param pawns The current array of pawns.
 * @param delta The time elapsed since the last update, in seconds.
 * @returns A new array of updated pawns.
 */
export const updatePawns = (pawns: Pawn[], delta: number): Pawn[] => {
    // This is a very simple simulation. In a real game, this would involve
    // state machines, behavior trees, and complex decision-making.
    
    return pawns.map(pawn => {
        if (pawn.status === 'Dead') return pawn;

        // Simple state change simulation
        if (Math.random() < 0.01 * delta) {
            const currentStatus = pawn.status;
            let nextStatus: Pawn['status'] = 'Idle';
            
            if (currentStatus === 'Idle') {
                nextStatus = 'Working';
            } else if (currentStatus === 'Working') {
                nextStatus = 'Idle';
            }
            
            return { ...pawn, status: nextStatus };
        }

        return pawn;
    });
};
