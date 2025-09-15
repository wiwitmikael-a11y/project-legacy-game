import React from 'react';
import { Pawn } from '../../engine/types';
import { useGameStore } from '../../engine/store';

// GDD Section 9.2: Heads-Up Display (HUD) -> Left-Side
// "Pawn Status panel (showing health, mood, current task)"

export const PawnStatusPanel: React.FC = () => {
    // For simplicity, we'll just show the first pawn.
    // A real implementation would have a pawn selection mechanism.
    const firstPawn = useGameStore((state) => state.pawns[0]);

    if (!firstPawn) {
        return <div className="pawn-status-panel">No Pawns Active</div>;
    }

    return (
        <div className="pawn-status-panel">
            <h4>Pawn Status</h4>
            <p><strong>Name:</strong> {firstPawn.name}</p>
            <p><strong>Status:</strong> {firstPawn.status}</p>
        </div>
    );
};
