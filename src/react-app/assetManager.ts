import * as PIXI from 'pixi.js';

// GDD Section 7.4: Asset Pipeline
// "A centralized asset manager should handle loading and caching of all visual and audio assets."

// This is a mock asset that can be used for placeholders.
// It's a 1x1 white pixel PNG, which is useful for tinting.
const placeholderAsset = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/epv2AAAAABJRU5ErkJggg==';


const ASSET_MANIFEST = {
    bundles: [{
        name: 'game-assets',
        assets: [
            // In a real project, these would point to actual image files.
            // We are using a placeholder data URL to avoid 404 errors.
            { name: 'rifle_body_sprite', srcs: placeholderAsset },
            { name: 'rifle_barrel_sprite', srcs: placeholderAsset },
            { name: 'armor_vest_sprite', srcs: placeholderAsset },
        ],
    }],
};

let assetsLoaded = false;

/**
 * Initializes and loads the game's asset bundle if it hasn't been loaded already.
 * @returns A promise that resolves when assets are loaded.
 */
export const loadGameAssets = async (): Promise<void> => {
    if (assetsLoaded) {
        return;
    }
    // The init method can be called multiple times, it will only process the manifest once.
    await PIXI.Assets.init({ manifest: ASSET_MANIFEST });
    // Load the bundle
    await PIXI.Assets.loadBundle('game-assets');
    assetsLoaded = true;
    console.log('Game assets loaded.');
};
