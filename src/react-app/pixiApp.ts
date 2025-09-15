// GDD Section 7.2: Rendering Engine - PixiJS
// This file initializes and exports a singleton PixiJS application instance.
// Using a lazy-initialized singleton to prevent "Script error" on initial load.

import * as PIXI from 'pixi.js';

let appInstance: PIXI.Application | null = null;

export const getPixiApp = (): PIXI.Application => {
    if (!appInstance) {
        appInstance = new PIXI.Application({
            resizeTo: window,
            backgroundColor: 0x1a1a1a, // A dark grey background to match the theme
            autoDensity: true,
            resolution: window.devicePixelRatio || 1,
        });
    }
    return appInstance;
};