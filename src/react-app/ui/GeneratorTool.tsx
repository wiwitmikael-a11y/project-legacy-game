import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

// GDD Section Dev Tools: Content Generator
// A tool for designers (or players) to generate new game content using AI.

const materialSchema = {
    type: Type.OBJECT,
    properties: {
        id: {
            type: Type.STRING,
            description: "A unique identifier for the material, snake_case and prefixed with 'mat_'. e.g., 'mat_glowing_crystal'."
        },
        name: {
            type: Type.STRING,
            description: "The display name of the material. e.g., 'Glowing Crystal'."
        },
        description: {
            type: Type.STRING,
            description: "A brief, flavorful description of the material."
        },
        tags: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING
            },
            description: "A list of tags that describe the material's properties. Choose from: 'Wood', 'Durable', 'Heavy', 'Crystal', 'Energy_Focus', 'Biomass', 'Bioluminescent', 'Lightweight', 'Metal', 'Component'."
        },
    },
};

export const GeneratorTool: React.FC = () => {
    const [prompt, setPrompt] = useState('A glowing, crystalline plant that pulses with energy.');
    const [generatedJson, setGeneratedJson] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const generateMaterial = async () => {
        if (!process.env.API_KEY) {
            setError('API_KEY environment variable not set.');
            return;
        }

        setIsLoading(true);
        setError('');
        setGeneratedJson('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Generate a new crafting material for a sci-fi game based on this description: "${prompt}"`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: materialSchema,
                    systemInstruction: "You are a creative content designer for a sci-fi video game. Your task is to generate new crafting materials in JSON format based on a user's description. The material ID should be a snake_case string prefixed with 'mat_'. The tags should be chosen from the following list: 'Wood', 'Durable', 'Heavy', 'Crystal', 'Energy_Focus', 'Biomass', 'Bioluminescent', 'Lightweight', 'Metal', 'Component'.",
                },
            });

            const text = response.text.trim();
            // Basic validation and formatting for better display
            JSON.parse(text); // Will throw an error if not valid JSON
            setGeneratedJson(JSON.stringify(JSON.parse(text), null, 2));

        } catch (e) {
            console.error("Error generating material:", e);
            setError(`Failed to generate content. ${e instanceof Error ? e.message : String(e)}`);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="generator-tool">
            <h3>AI Material Generator</h3>
            <p>Describe a new crafting material.</p>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="e.g., A petrified, glowing mushroom."
            />
            <button onClick={generateMaterial} disabled={isLoading || !prompt.trim()}>
                {isLoading ? 'Generating...' : 'Generate'}
            </button>

            {error && <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            
            {generatedJson && (
                <div className="generated-output" style={{ marginTop: '10px' }}>
                    <h4>Generated JSON:</h4>
                    <pre>
                        <code>
                            {generatedJson}
                        </code>
                    </pre>
                </div>
            )}
        </div>
    );
};