import * as PIXI from 'pixi.js';
import { useGameStore } from './store';
import { Pawn } from './types';

// GDD Section 7.2: Rendering Engine - PixiJS
// This class manages the visual representation of the game state on the PixiJS stage.

export class Simulation {
    private app: PIXI.Application;
    private pawnSprites: Map<string, PIXI.Text> = new Map();

    constructor(app: PIXI.Application) {
        this.app = app;
        this.initialize();
    }

    private initialize(): void {
        // Subscribe to game state changes to create/destroy sprites
        // FIX: The base `subscribe` method from zustand expects a single listener callback, not a selector and a listener.
        // The listener is fired on every state change, so we compare the `pawns` slice of state to avoid unnecessary updates.
        useGameStore.subscribe(
            (state, prevState) => {
                // Only update sprites if the pawns array has changed.
                if (state.pawns !== prevState.pawns) {
                    this.syncPawnSprites(state.pawns);
                }
            }
        );
        // Initial sync
        this.syncPawnSprites(useGameStore.getState().pawns);
    }
    
    // Create, update, and remove sprites to match the pawn state
    private syncPawnSprites(pawns: Pawn[]): void {
        const existingPawnIds = new Set(this.pawnSprites.keys());
        
        pawns.forEach((pawn, index) => {
            let sprite = this.pawnSprites.get(pawn.id);

            if (!sprite) {
                // Create new sprite for new pawn
                sprite = new PIXI.Text(`${pawn.name}\n[${pawn.status}]`, {
                    fontFamily: 'Arial',
                    fontSize: 14,
                    fill: 0xffffff,
                    align: 'center',
                });
                sprite.anchor.set(0.5);
                sprite.x = 100 + index * 120;
                sprite.y = 100;
                this.app.stage.addChild(sprite);
                this.pawnSprites.set(pawn.id, sprite);
            } else {
                // Update existing sprite
                 sprite.text = `${pawn.name}\n[${pawn.status}]`;
            }
            
            // Remove from the set of pawns to be deleted
            existingPawnIds.delete(pawn.id);
        });

        // Remove sprites for pawns that no longer exist
        existingPawnIds.forEach(pawnId => {
            const sprite = this.pawnSprites.get(pawnId);
            if (sprite) {
                this.app.stage.removeChild(sprite);
                sprite.destroy();
                this.pawnSprites.delete(pawnId);
            }
        });
    }

    // This method is called every frame from the main game loop
    public update(): void {
        // Here you would add continuous visual updates, like movement animations.
        // For this simple example, most updates are state-driven via the store subscription.
        this.pawnSprites.forEach(sprite => {
            // e.g., make them bob up and down slightly
            sprite.y += Math.sin(Date.now() / 200 + sprite.x) * 0.1;
        });
    }

    public destroy(): void {
        // Clean up all sprites and containers from the stage
        this.app.stage.removeChildren();
        this.pawnSprites.clear();
    }
}
