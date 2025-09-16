import React from 'react';
import { useGameStore } from '../../engine/store';
import { Pawn } from '../../engine/types';

// GDD Section 9.2: Heads-Up Display (HUD) -> Bottom-Left
// "Pawn Status indicators (health, status, etc.)"

export const PawnStatusPanel: React.FC = () => {
    const pawns = useGameStore((state) => state.pawns);

    if (!pawns || pawns.length === 0) {
        return null;
    }

    return (
        <div className="pawn-status-panel">
            <h4>Crew Status</h4>
            {pawns.map((pawn: Pawn) => (
                <div key={pawn.id} className="pawn-status-item">
                    <div className="pawn-name">{pawn.name}</div>
                    <div className="pawn-hp-bar">
                        <div 
                            className="pawn-hp-fill" 
                            style={{ width: `${(pawn.hp / pawn.maxHp) * 100}%` }}
                        />
                    </div>
                    <div className="pawn-status-text">{pawn.hp.toFixed(0)} / {pawn.maxHp} - {pawn.status}</div>
                </div>
            ))}
        </div>
    );
};
