import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { getPixiApp } from './pixiApp';
import { useGameStore } from '../engine/store';
import { loadGameAssets } from './assetManager';
import { Simulation } from '../engine/simulation';

// GDD Section 7.2: Rendering Engine - PixiJS
// This component is the bridge between React and the PixiJS canvas.

export const Game: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const simulationRef = useRef<Simulation | null>(null);

    useEffect(() => {
        let pixiApp = getPixiApp();
        let sim: Simulation;

        const init = async () => {
            if (!canvasRef.current) return;
            
            // Append the PixiJS view to the DOM
            canvasRef.current.appendChild(pixiApp.view as unknown as Node);

            // Load assets before starting the simulation
            await loadGameAssets();
            
            // Start the simulation
            sim = new Simulation(pixiApp);
            simulationRef.current = sim;

            // Start the game loop
            pixiApp.ticker.add(gameLoop);
        };

        const gameLoop = (ticker: PIXI.Ticker) => {
            // PIXI.Ticker.deltaTime is in frames, we need it in seconds for the store
            const deltaInSeconds = ticker.deltaMS / 1000;
            useGameStore.getState().actions.gameTick(deltaInSeconds);

            // Update the simulation visuals
            if (simulationRef.current) {
                simulationRef.current.update();
            }
        };

        init();

        return () => {
            // Cleanup on component unmount
            if (pixiApp) {
                pixiApp.ticker.remove(gameLoop);
            }
            if (simulationRef.current) {
                simulationRef.current.destroy();
            }
            // Note: We don't destroy the pixiApp itself as it's a singleton.
            // In a more complex app with scene changes, you might handle this differently.
            if (canvasRef.current && pixiApp.view) {
                 try {
                    canvasRef.current.removeChild(pixiApp.view as unknown as Node);
                } catch (e) {
                    // It might already be gone
                }
            }
        };
    }, []);

    return <div ref={canvasRef} className="game-canvas-container" />;
};
