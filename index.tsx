import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './src/react-app/App';

// GDD Section 7.1: Technology Stack - React
// This file is the main entry point for the React application.

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
