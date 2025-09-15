

import React, { useState, useCallback } from 'react';
import { useGameStore } from '../../engine/store';
import { ItemPreview } from './ItemPreview';
import { Blueprint, Material, SynthesizedItem } from '../../engine/types';

export const LegacyScreen: React.FC = () => {
    const { toggleLegacyScreen, craftItem } = useGameStore((state) => state.actions);
    const { blueprints, materials } = useGameStore();

    const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>(blueprints[0]?.id || '');
    const [selectedMaterials, setSelectedMaterials] = useState<Record<string, string>>({});
    const [draggedMaterial, setDraggedMaterial] = useState<Material | null>(null);
    const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
    const [lastCraftedItem, setLastCraftedItem] = useState<SynthesizedItem | null>(null);

    const selectedBlueprint = blueprints.find(bp => bp.id === selectedBlueprintId);

    const handleCraft = () => {
        if (!selectedBlueprint) return;
        const crafted = craftItem(selectedBlueprint.id, selectedMaterials);
        if (crafted) {
            setLastCraftedItem(crafted);
        }
    };
    
    const handleDragStart = (e: React.DragEvent, material: Material) => {
        setDraggedMaterial(material);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (e: React.DragEvent, slotId: string) => {
        e.preventDefault();
        if (draggedMaterial) {
            const slot = selectedBlueprint?.slots.find(s => s.id === slotId);
            if (slot && slot.allowedTags.some(tag => draggedMaterial.tags.includes(tag))) {
                setSelectedMaterials(prev => ({ ...prev, [slotId]: draggedMaterial.id }));
            }
        }
        setActiveDropZone(null);
    };

    const handleDragOver = (e: React.DragEvent, slotId: string) => {
        e.preventDefault();
        setActiveDropZone(slotId);
    };

    const handleDragLeave = () => {
        setActiveDropZone(null);
    };

    const handleBlueprintChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBlueprintId(e.target.value);
        setSelectedMaterials({}); // Reset slots on blueprint change
        setLastCraftedItem(null);
    };

    const isCraftable = selectedBlueprint && selectedBlueprint.slots.every(slot => selectedMaterials[slot.id]);

    return (
        <div className="overlay-screen legacy-screen">
            <div className="legacy-container">
                <h2>Legacy System - Item Synthesis</h2>
                <div className="crafting-interface">
                    <div className="inventory-panel">
                        <h4>Materials</h4>
                        <div className="inventory-list">
                            {materials.map(mat => (
                                <div 
                                    key={mat.id} 
                                    className="inventory-item"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, mat)}
                                >
                                    {mat.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="crafting-panel">
                        <h4>Blueprint</h4>
                         <div className="blueprint-selector">
                            <select value={selectedBlueprintId} onChange={handleBlueprintChange}>
                                {blueprints.map(bp => <option key={bp.id} value={bp.id}>{bp.name}</option>)}
                            </select>
                        </div>
                        {selectedBlueprint && (
                            <div className="blueprint-slots">
                                {selectedBlueprint.slots.map(slot => {
                                    const materialInSlot = materials.find(m => m.id === selectedMaterials[slot.id]);
                                    return (
                                        <div 
                                            key={slot.id} 
                                            className={`blueprint-slot ${activeDropZone === slot.id ? 'drag-over' : ''}`}
                                            onDrop={(e) => handleDrop(e, slot.id)}
                                            onDragOver={(e) => handleDragOver(e, slot.id)}
                                            onDragLeave={handleDragLeave}
                                        >
                                            <strong>{slot.name}: </strong>
                                            {materialInSlot ? <span className="item-name">{materialInSlot.name}</span> : 'Drag material here'}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <button onClick={handleCraft} disabled={!isCraftable}>Synthesize</button>
                    </div>

                    <div className="result-panel">
                        <h4>Result Preview</h4>
                        <ItemPreview item={lastCraftedItem} />
                        {lastCraftedItem && (
                            <div className="stats">
                                {/* FIX: Explicitly convert stat values to strings to prevent rendering errors. */}
                                {Object.entries(lastCraftedItem.finalStats).map(([key, value]) => (
                                    <p key={key}><strong>{key}:</strong> {String(value)}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <button onClick={toggleLegacyScreen}>Close</button>
            </div>
        </div>
    );
};