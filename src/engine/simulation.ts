import * as PIXI from 'pixi.js';
import { useGameStore } from './store';
import { Pawn } from './types';

// GDD Section 7.2: Rendering Engine - PixiJS
// "The simulation layer will be responsible for translating game state into visual representation on the PixiJS stage."

export class Simulation {
    private app: PIXI.Application;
    private pawnSprites: Map<string, PIXI.Graphics> = new Map();
    private unsubscribe: () => void;

    constructor(app: PIXI.Application) {
        this.app = app;

        // Subscribe to pawn state changes to add/remove sprites.
        this.unsubscribe = useGameStore.subscribe(
            (state, prevState) => {
                // A shallow compare is enough since the pawnEngine creates a new array.
                if (state.pawns !== prevState.pawns) {
                    this.syncPawnSprites(state.pawns);
                }
            }
        );

        // Initial sync
        this.syncPawnSprites(useGameStore.getState().pawns);
    }

    /**
     * Ensures the PIXI stage has a sprite for each pawn and removes sprites for pawns that no longer exist.
     */
    private syncPawnSprites(pawns: Pawn[]) {
        const pawnIds = new Set(pawns.map(p => p.id));

        // Add new sprites
        for (const pawn of pawns) {
            if (!this.pawnSprites.has(pawn.id)) {
                const sprite = new PIXI.Graphics();
                // We will set the color in the update loop
                sprite.x = pawn.x;
                sprite.y = pawn.y;

                this.pawnSprites.set(pawn.id, sprite);
                this.app.stage.addChild(sprite);
            }
        }

        // Remove old sprites
        for (const [id, sprite] of this.pawnSprites.entries()) {
            if (!pawnIds.has(id)) {
                this.app.stage.removeChild(sprite);
                sprite.destroy();
                this.pawnSprites.delete(id);
            }
        }
    }

    /**
     * The main update loop called by the PIXI ticker.
     * It reads the latest game state and updates the positions/visuals of sprites.
     */
    public update(): void {
        const pawns = useGameStore.getState().pawns;
        for (const pawn of pawns) {
            const sprite = this.pawnSprites.get(pawn.id);
            if (sprite) {
                // Animate position smoothly towards target
                sprite.x += (pawn.x - sprite.x) * 0.1;
                sprite.y += (pawn.y - sprite.y) * 0.1;
                
                // Update color based on status and health
                let color = 0x00ff00; // Default to green (idle)
                if (pawn.status === 'working') {
                    color = 0x00aaff; // Light blue for working
                } else if (pawn.status === 'injured') {
                    color = 0xffa500; // Orange for injured
                }

                // Health override: As HP drops, tint it red
                const healthRatio = pawn.hp / pawn.maxHp;
                if (healthRatio < 0.3) {
                    color = 0xff0000; // Critical health is red
                } else if (healthRatio < 0.6 && pawn.status !== 'working') {
                    // Don't override working color unless critical
                    color = 0xffa500; // Low health is orange
                }

                // Redraw the sprite with the new color and size
                sprite.clear();
                sprite.beginFill(color);
                sprite.drawCircle(0, 0, 10);
                sprite.endFill();
            }
        }
    }

    /**
     * Cleans up resources when the simulation is no longer needed.
     */
    public destroy(): void {
        // Unsubscribe from the store to prevent memory leaks
        this.unsubscribe();

        // Clean up all sprites from the stage
        for (const sprite of this.pawnSprites.values()) {
            this.app.stage.removeChild(sprite);
            sprite.destroy();
        }
        this.pawnSprites.clear();
    }
}
