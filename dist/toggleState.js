import { ListenerList } from "./eventListenerList";
import { JuceEvents } from "./events";
/**
 * ToggleState encapsulates data and callbacks that are synchronised with a WebToggleRelay object
 * on the backend.
 *
 * Use getToggleState() to create a ToggleState object. This object will be synchronised with the
 * WebToggleRelay backend object that was created using the same unique name.
 */
export class ToggleState {
    name;
    identifier;
    value;
    properties;
    valueChangedEvent;
    propertiesChangedEvent;
    constructor(name) {
        if (!window.__JUCE__.initialisationData.__juce__toggles.includes(name))
            console.warn("Creating ToggleState for '" +
                name +
                "', which is unknown to the backend");
        this.name = name;
        this.identifier = "__juce__toggle" + this.name;
        this.value = false;
        this.properties = {
            name: "",
            parameterIndex: -1,
        };
        this.valueChangedEvent = new ListenerList();
        this.propertiesChangedEvent = new ListenerList();
        window.__JUCE__.backend.addEventListener(this.identifier, (event) => this.handleEvent(event));
        window.__JUCE__.backend.emitEvent(this.identifier, {
            eventType: "requestInitialUpdate",
        });
    }
    /** Returns the value corresponding to the associated WebToggleRelay's (C++) state. */
    getValue() {
        return this.value;
    }
    /** Informs the backend to change the associated WebToggleRelay's (C++) state. */
    setValue(newValue) {
        this.value = newValue;
        window.__JUCE__.backend.emitEvent(this.identifier, {
            eventType: JuceEvents.ControlValueChanged,
            value: this.value,
        });
    }
    /** Internal. */
    handleEvent(event) {
        if (event.eventType == JuceEvents.ControlValueChanged) {
            this.value = event.value;
            this.valueChangedEvent.callListeners();
        }
        if (event.eventType == JuceEvents.ControlPropertiesChanged) {
            // eslint-disable-next-line no-unused-vars
            let { eventType: _, ...rest } = event;
            this.properties = rest;
            this.propertiesChangedEvent.callListeners();
        }
    }
}
//# sourceMappingURL=toggleState.js.map