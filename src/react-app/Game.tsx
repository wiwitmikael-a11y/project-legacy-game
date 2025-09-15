
import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { getPixiApp } from './pixiApp';
import { useGameInput } from './hooks/useGameInput';
import { loadGameAssets } from './assetManager';
import { tickDneEngine } from '../engine/dneEngine';
import { useGameStore } from '../engine/store';

export const Game: React.FC = () => {
    const pixiContainer = useRef<HTMLDivElement>(null);
    useGameInput(); // Activate keyboard controls

    useEffect(() => {
        const container = pixiContainer.current;
        if (!container) return;

        const app = getPixiApp();
        let isAppMounted = false;

        const initPixi = async () => {
            try {
                await loadGameAssets();
                
                if (pixiContainer.current) {
                    container.appendChild(app.view as HTMLCanvasElement);
                    isAppMounted = true;
                    app.start();

                    // --- Game Loop Integration ---
                    const gameLoop = (delta: PIXI.Ticker) => {
                        const { isPaused, timeScale } = useGameStore.getState();
                        if (isPaused) return;

                        const adjustedDelta = delta.deltaTime * timeScale;
                        
                        // Call all engine ticks here
                        tickDneEngine();
                        // Other systems like pawn movement, resource generation would be ticked here...
                    };

                    app.ticker.add(gameLoop);

                    // Cleanup ticker on unmount
                    return () => {
                        app.ticker.remove(gameLoop);
                    };
                }
            } catch (error) {
                console.error("Failed to initialize PixiJS app:", error);
            }
        };

        let cleanupTicker: (() => void) | undefined;
        initPixi().then(cleanup => {
            cleanupTicker = cleanup;
        });

        return () => {
            if (cleanupTicker) {
                cleanupTicker();
            }
            if (isAppMounted && container.contains(app.view as HTMLCanvasElement)) {
                app.stop();
                container.removeChild(app.view as HTMLCanvasElement);
            }
        };
    }, []);

    // The canvas container no longer forces itself to be in the background.
    // CSS will manage the layering correctly.
    return <div ref={pixiContainer} className="pixi-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />;
};
