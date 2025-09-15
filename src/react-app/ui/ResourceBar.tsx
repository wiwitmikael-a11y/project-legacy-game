import React from 'react';
import { useGameStore } from '../../engine/store';

// GDD Section 9.2: Heads-Up Display (HUD) -> Top Bar
// "Tampilan sumber daya utama (Power, Biomass, Alloys, Components, Pawn Count)"

export const ResourceBar: React.FC = () => {
    const { resources, pawnCount } = useGameStore();

    return (
        <div className="resource-bar" aria-label="Game Resources">
            <div className="resource-item">⚡ Power: {resources.power}</div>
            <div className="resource-item">🌿 Biomass: {resources.biomass}</div>
            <div className="resource-item">🔩 Alloys: {resources.alloys}</div>
            <div className="resource-item">⚙️ Components: {resources.components}</div>
            <div className="resource-item">👤 Pawns: {pawnCount}</div>
        </div>
    );
};
