import React from 'react';
import { Dilemma } from '../../engine/types';
import { useGameStore } from '../../engine/store';

// GDD DNE System: The UI for presenting dilemmas to the player.

interface DilemmaModalProps {
    dilemma: Dilemma;
}

export const DilemmaModal: React.FC<DilemmaModalProps> = ({ dilemma }) => {
    const { resolveDilemma } = useGameStore((state) => state.actions);

    return (
        <div className="overlay-screen dilemma-modal">
            <div className="dilemma-container">
                <h2>{dilemma.title}</h2>
                <p>{dilemma.description}</p>
                <div className="dilemma-choices">
                    {dilemma.choices.map((choice, index) => (
                        <button key={index} onClick={() => resolveDilemma(choice)}>
                            {choice.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
