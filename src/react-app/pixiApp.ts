// GDD Section 7.2: Rendering Engine - PixiJS
// This file initializes and exports a singleton PixiJS application instance.
// The app is lazy-initialized via getPixiApp() to ensure it's only created after the DOM is ready.
// Creating it prematurely could lead to a generic "Script error" if the canvas element isn't available yet.

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