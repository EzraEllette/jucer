export class ListenerList {
  listeners: Map<number, Function>;
  listenerId: number;
  constructor() {
    this.listeners = new Map();
    this.listenerId = 0;
  }

  addListener(fn: Function) {
    const newListenerId = this.listenerId++;
    this.listeners.set(newListenerId, fn);
    return newListenerId;
  }

  removeListener(id: number) {
    if (this.listeners.has(id)) {
      this.listeners.delete(id);
    }
  }

  callListeners(payload?: any) {
    for (const [, value] of this.listeners) {
      value(payload);
    }
  }
}

export class EventListenerList {
  eventListeners: Map<any, any>;
  constructor() {
    this.eventListeners = new Map();
  }

  addEventListener(eventId, fn) {
    if (!this.eventListeners.has(eventId))
      this.eventListeners.set(eventId, new ListenerList());

    const id = this.eventListeners.get(eventId).addListener(fn);

    return [eventId, id];
  }

  removeEventListener(eventId: number, id: number) {
    if (this.eventListeners.has(eventId)) {
      this.eventListeners.get(eventId).removeListener(id);
    }
  }

  emitEvent(eventId, object) {
    if (this.eventListeners.has(eventId))
      this.eventListeners.get(eventId).callListeners(object);
  }
}
