import React from 'react';
import { useGameStore } from '../../engine/store';

// GDD Section 9.2: Heads-Up Display (HUD) -> Top-Left
// "Resource indicators (e.g., Materials, Power, etc.)"

export const ResourceBar: React.FC = () => {
    const materials = useGameStore((state) => state.materials);
    const inventory = useGameStore((state) => state.inventory);

    return (
        <div className="resource-bar">
            <span>Materials: {materials.length}</span>
            <span>Crafted Items: {inventory.length}</span>
        </div>
    );
};
