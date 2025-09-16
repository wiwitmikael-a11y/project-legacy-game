import React from 'react';
import { ResourceBar } from './ResourceBar';
import { TimeControls } from '../hooks/TimeControls';
import { useGameStore } from '../../engine/store';

export const HUD: React.FC = () => {
    const { toggleLegacyScreen, toggleGeneratorTool, triggerDilemma } = useGameStore(state => state.actions);

    return (
        <div className="hud-container">
            <ResourceBar />
            
            <div className="dev-controls">
                <button onClick={toggleLegacyScreen}>Legacy System</button>
                <button onClick={toggleGeneratorTool}>Dev Tools</button>
                <button onClick={triggerDilemma}>Trigger Dilemma</button>
            </div>

            <TimeControls />
        </div>
    );
};