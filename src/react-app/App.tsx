
import React from 'react';
import { Game } from './Game';
import { HUD } from './ui/HUD';
import { DilemmaModal } from './ui/DilemmaModal';
import { LegacyScreen } from './ui/LegacyScreen';
import { useGameStore } from '../engine/store';
import { GeneratorTool } from './ui/GeneratorTool';

// GDD Section 9.0: Application Shell
// This is the root React component that assembles the entire UI.

export const App: React.FC = () => {
    const { currentDilemma, isLegacyScreenOpen, isGeneratorToolOpen } = useGameStore();

    return (
        <main className="app-container">
            <Game />
            <HUD />

            {/* Conditional Overlays */}
            {currentDilemma && <DilemmaModal dilemma={currentDilemma} />}
            {isLegacyScreenOpen && <LegacyScreen />}
            {isGeneratorToolOpen && <GeneratorTool />}
        </main>
    );
};
