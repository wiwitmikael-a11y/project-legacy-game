import React from 'react';
import { SynthesizedItem } from '../../engine/types';

interface ItemPreviewProps {
    item: SynthesizedItem | null;
}

// GDD BASE System: Part IV - Layered Sprite System Visualization
// This component renders a preview of a synthesized item based on its visual layers.

export const ItemPreview: React.FC<ItemPreviewProps> = ({ item }) => {
    if (!item) {
        return (
            <div className="item-preview-placeholder" style={{ 
                border: '1px dashed grey', 
                padding: '20px', 
                textAlign: 'center', 
                color: '#aaa',
                height: '220px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <p>Preview will appear here once all materials are selected.</p>
            </div>
        );
    }

    // A simple representation of an item, maybe a weapon or armor piece shape
    // using borders. A real implementation would use SVGs or actual images.
    const containerStyle: React.CSSProperties = {
        position: 'relative',
        width: '150px',
        height: '150px',
        margin: '20px auto',
        backgroundColor: '#111'
    };

    return (
        <div className="item-preview-container">
            <h4>{item.blueprintName}</h4>
            <div className="item-sprite-container" style={containerStyle}>
                {item.visualLayers.map((layer, index) => {
                    const colorHex = `#${layer.color.toString(16).padStart(6, '0')}`;

                    const style: React.CSSProperties = {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: colorHex,
                        opacity: 0.7,
                        // This will create different blending effects for each layer
                        mixBlendMode: index % 2 === 0 ? 'screen' : 'multiply',
                        zIndex: index,
                    };

                    if (layer.emissive) {
                        style.boxShadow = `0 0 20px 8px ${colorHex}`;
                        style.zIndex = index + 10; // Emissive layers should be on top
                    }

                    // For a more varied look, let's use a clip-path to give some shape.
                    // This is a very basic way to simulate different item parts.
                    if (item.blueprintId === 'bp_rifle' && layer.id === 'barrel') {
                         style.clipPath = 'polygon(0 40%, 100% 40%, 100% 60%, 0 60%)';
                    } else if (item.blueprintId === 'bp_rifle' && layer.id === 'body') {
                         style.clipPath = 'polygon(0% 20%, 60% 20%, 60% 0%, 75% 0%, 75% 20%, 100% 20%, 100% 80%, 75% 80%, 75% 100%, 60% 100%, 60% 80%, 0% 80%)';
                    } else if (item.blueprintId === 'bp_armor' && layer.id === 'vest') {
                         style.clipPath = 'polygon(20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%, 0 20%)';
                    }

                    return <div key={`${layer.id}-${index}`} className="sprite-layer" style={style} />;
                })}
            </div>
        </div>
    );
};
