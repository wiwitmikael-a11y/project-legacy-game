import React from 'react';
import { useGameStore } from '../engine/store';
import { Game } from './Game';
import { HUD } from './ui/HUD';
import { LegacyScreen } from './ui/LegacyScreen';
import { DilemmaModal } from './ui/DilemmaModal';
import { GeneratorTool } from './ui/GeneratorTool';
import { PawnStatusPanel } from './ui/PawnStatusPanel';
import { useGameInput } from './hooks/useGameInput';

// GDD Section 7.1: Technology Stack - React
// This is the root component of the React application. It orchestrates all other UI components.

export const App: React.FC = () => {
    const showLegacyScreen = useGameStore((state) => state.showLegacyScreen);
    const showGeneratorTool = useGameStore((state) => state.showGeneratorTool);
    const activeDilemma = useGameStore((state) => state.activeDilemma);

    // Initialize keyboard controls
    useGameInput();

    return (
        <div className="app-container">
            <Game />
            <HUD />
            <PawnStatusPanel />
            
            {/* Overlays */}
            {showLegacyScreen && <LegacyScreen />}
            {activeDilemma && <DilemmaModal dilemma={activeDilemma} />}
            
            {/* Dev Tools Panel */}
            {showGeneratorTool && (
                <div className="overlay-screen">
                    <div className="overlay-content-container dev-tool-container">
                         <GeneratorTool />
                    </div>
                </div>
            )}
        </div>
    );
};
