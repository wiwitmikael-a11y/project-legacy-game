// GDD Section 8.3: Event-Driven Architecture.
// "The entire simulation should run on an event bus."
// Using 'mitt' as a lightweight, efficient event emitter.

import mitt from 'mitt';

// Define event types here for type safety
type Events = {
  'game:loaded': void;
  'pawn:died': { id: string };
  'blueprint:discovered': { name: string };
};

export const eventBus = mitt<Events>();
