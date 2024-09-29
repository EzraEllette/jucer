import { JuceEvents } from "./events";
export class PromiseHandler {
    lastPromiseId;
    promises;
    constructor() {
        this.lastPromiseId = 0;
        this.promises = new Map();
        window.__JUCE__.backend.addEventListener(JuceEvents.Complete, ({ promiseId, result }) => {
            if (this.promises.has(promiseId)) {
                this.promises.get(promiseId).resolve(result);
                this.promises.delete(promiseId);
            }
        });
    }
    createPromise() {
        const promiseId = this.lastPromiseId++;
        const result = new Promise((resolve, reject) => {
            this.promises.set(promiseId, { resolve: resolve, reject: reject });
        });
        return [promiseId, result];
    }
}
//# sourceMappingURL=promiseHandler.js.map