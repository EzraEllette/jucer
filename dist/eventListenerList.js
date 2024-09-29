export class ListenerList {
    listeners;
    listenerId;
    constructor() {
        this.listeners = new Map();
        this.listenerId = 0;
    }
    addListener(fn) {
        const newListenerId = this.listenerId++;
        this.listeners.set(newListenerId, fn);
        return newListenerId;
    }
    removeListener(id) {
        if (this.listeners.has(id)) {
            this.listeners.delete(id);
        }
    }
    callListeners(payload) {
        for (const [, value] of this.listeners) {
            value(payload);
        }
    }
}
export class EventListenerList {
    eventListeners;
    constructor() {
        this.eventListeners = new Map();
    }
    addEventListener(eventId, fn) {
        if (!this.eventListeners.has(eventId))
            this.eventListeners.set(eventId, new ListenerList());
        const id = this.eventListeners.get(eventId).addListener(fn);
        return [eventId, id];
    }
    removeEventListener(eventId, id) {
        if (this.eventListeners.has(eventId)) {
            this.eventListeners.get(eventId).removeListener(id);
        }
    }
    emitEvent(eventId, object) {
        if (this.eventListeners.has(eventId))
            this.eventListeners.get(eventId).callListeners(object);
    }
}
//# sourceMappingURL=eventListenerList.js.map