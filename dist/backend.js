import { EventListenerList } from "./eventListenerList";
export class Backend {
    listeners;
    constructor() {
        this.listeners = new EventListenerList();
    }
    addEventListener(eventId, fn) {
        return this.listeners.addEventListener(eventId, fn);
    }
    removeEventListener([eventId, id]) {
        this.listeners.removeEventListener(eventId, id);
    }
    emitEvent(eventId, object) {
        window.__JUCE__.postMessage(JSON.stringify({ eventId: eventId, payload: object }));
    }
    emitByBackend(eventId, object) {
        this.listeners.emitEvent(eventId, JSON.parse(object));
    }
}
//# sourceMappingURL=backend.js.map