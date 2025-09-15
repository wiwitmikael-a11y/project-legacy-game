
import React from 'react';
import { ResourceBar } from './ResourceBar';
import { TimeControls } from './TimeControls';
import { useGameStore } from '../../engine/store';

export const HUD: React.FC = () => {
    const { toggleLegacyScreen, toggleGeneratorTool } = useGameStore(state => state.actions);

    return (
        <div className="hud-container">
            <ResourceBar />
            
            <div className="dev-controls">
                <button onClick={toggleLegacyScreen}>Legacy System</button>
                <button onClick={toggleGeneratorTool}>Dev Tools</button>
            </div>

            <TimeControls />
        </div>
    );
};
