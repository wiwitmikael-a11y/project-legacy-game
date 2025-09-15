import React from 'react';
import { useGameStore } from '../../engine/store';

// GDD Section 9.2: Heads-Up Display (HUD) -> Bottom-Right
// "Kontrol Waktu (Pause, Play, Fast x2, Ultra x3)"

export const TimeControls: React.FC = () => {
    const isPaused = useGameStore((state) => state.isPaused);
    const timeScale = useGameStore((state) => state.timeScale);
    const { togglePause, setTimeScale } = useGameStore((state) => state.actions);

    return (
        <div className="time-controls" aria-label="Time Controls">
            <button 
                onClick={togglePause} 
                className={isPaused ? 'active' : ''}
                aria-pressed={isPaused}
            >
                ❚❚
            </button>
            <button 
                onClick={() => setTimeScale(1)} 
                className={!isPaused && timeScale === 1 ? 'active' : ''}
                aria-pressed={!isPaused && timeScale === 1}
            >
                ▶ 1x
            </button>
            <button 
                onClick={() => setTimeScale(2)} 
                className={!isPaused && timeScale === 2 ? 'active' : ''}
                aria-pressed={!isPaused && timeScale === 2}
            >
                ▶▶ 2x
            </button>
             <button 
                onClick={() => setTimeScale(3)} 
                className={!isPaused && timeScale === 3 ? 'active' : ''}
                aria-pressed={!isPaused && timeScale === 3}
            >
                ▶▶▶ 3x
            </button>
        </div>
    );
};
