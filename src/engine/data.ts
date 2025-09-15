import { Blueprint, Material } from './types';

// GDD BASE System: Initial data for crafting.

export const INITIAL_MATERIALS: Material[] = [
    { id: 'mat_ironwood', name: 'Ironwood', description: 'A dense, metallic wood.', tags: ['Wood', 'Durable', 'Heavy'] },
    { id: 'mat_titanium', name: 'Titanium', description: 'A light and strong metal.', tags: ['Metal', 'Durable', 'Lightweight'] },
    { id: 'mat_crystal', name: 'Phase Crystal', description: 'A crystal that hums with energy.', tags: ['Crystal', 'Energy_Focus'] },
    { id: 'mat_chitin', name: 'Arachnid Chitin', description: 'Lightweight but brittle plating.', tags: ['Biomass', 'Lightweight'] },
    { id: 'mat_bioloom', name: 'Bioluminescent Loom', description: 'Woven fibers that emit a soft glow.', tags: ['Biomass', 'Bioluminescent'] },
];

export const INITIAL_BLUEPRINTS: Blueprint[] = [
    {
        id: 'bp_rifle',
        name: 'Assault Rifle',
        description: 'A standard-issue kinetic firearm.',
        slots: [
            { id: 'slot_body', name: 'Receiver', allowedTags: ['Metal', 'Wood'] },
            { id: 'slot_core', name: 'Power Core', allowedTags: ['Crystal', 'Component'] },
        ],
        baseStats: {
            damage: 10,
            fireRate: 5,
            accuracy: 80,
            weight: 10,
            durability: 100,
        },
        baseSpriteLayers: [
            { id: 'body', spriteId: 'rifle_body_sprite', color: 0x555555 },
            { id: 'barrel', spriteId: 'rifle_barrel_sprite', color: 0x333333 },
        ],
    },
    {
        id: 'bp_armor',
        name: 'Combat Vest',
        description: 'Protective plating for the torso.',
        slots: [
            { id: 'slot_plating', name: 'Plating', allowedTags: ['Metal', 'Biomass'] },
            { id: 'slot_core', name: 'Core Matrix', allowedTags: ['Crystal', 'Component'] },
        ],
        baseStats: {
            defense: 20,
            mobility: -5,
            weight: 15,
            durability: 150,
        },
        baseSpriteLayers: [
            { id: 'vest', spriteId: 'armor_vest_sprite', color: 0x4a4a4a },
        ],
    }
];
