// GDD Section 9.3: Input & Controls Scheme (PC Web)
// "Spacebar for Pause/Play. 1, 2, 3 for control speed."

import { useEffect } from 'react';
import { useGameStore } from '../../engine/store';

export const useGameInput = () => {
    const { togglePause, setTimeScale } = useGameStore((state) => state.actions);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'Space':
                    event.preventDefault();
                    togglePause();
                    break;
                case 'Digit1':
                    event.preventDefault();
                    setTimeScale(1);
                    break;
                case 'Digit2':
                    event.preventDefault();
                    setTimeScale(2);
                    break;
                case 'Digit3':
                    event.preventDefault();
                    setTimeScale(3);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [togglePause, setTimeScale]);
};
