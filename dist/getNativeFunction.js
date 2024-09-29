import { JuceEvents } from "./events";
import { PromiseHandler } from "./promiseHandler";
const promiseHandler = new PromiseHandler();
/**
 * Returns a function object that calls a function registered on the JUCE backend and forwards all
 * parameters to it.
 *
 * The provided name should be the same as the name argument passed to
 * WebBrowserComponent::Options.withNativeFunction() on the backend.
 *
 * @param {String} name
 */
export function getNativeFunction(name) {
    if (!window.__JUCE__.initialisationData.__juce__functions.includes(name))
        console.warn(`Creating native function binding for '${name}', which is unknown to the backend`);
    const f = function () {
        const [promiseId, result] = promiseHandler.createPromise();
        window.__JUCE__.backend.emitEvent(JuceEvents.Invoke, {
            name: name,
            params: Array.prototype.slice.call(arguments),
            resultId: promiseId,
        });
        return result;
    };
    return f;
}
//# sourceMappingURL=getNativeFunction.js.map