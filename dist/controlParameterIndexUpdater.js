import { JuceEvents } from "./events";
/**
 * This helper class is intended to aid the implementation of
 * AudioProcessorEditor::getControlParameterIndex() for editors using a WebView interface.
 *
 * Create an instance of this class and call its handleMouseMove() method in each mousemove event.
 *
 * This class can be used to continuously report the controlParameterIndexAnnotation attribute's
 * value related to the DOM element that is currently under the mouse pointer.
 *
 * This value is defined at all times as follows
 * * the annotation attribute's value for the DOM element directly under the mouse, if it has it,
 * * the annotation attribute's value for the first parent element, that has it,
 * * -1 otherwise.
 *
 * Whenever there is a change in this value, an event is emitted to the frontend with the new value.
 * You can use a ControlParameterIndexReceiver object on the backend to listen to these events.
 *
 * @param {String} controlParameterIndexAnnotation
 */
export class ControlParameterIndexUpdater {
    controlParameterIndexAnnotation;
    lastElement;
    lastControlParameterIndex;
    constructor(controlParameterIndexAnnotation) {
        this.controlParameterIndexAnnotation = controlParameterIndexAnnotation;
        this.lastElement = null;
        this.lastControlParameterIndex = null;
    }
    handleMouseMove(event) {
        const currentElement = document.elementFromPoint(event.clientX, event.clientY);
        if (currentElement === this.lastElement)
            return;
        this.lastElement = currentElement;
        let controlParameterIndex = -1;
        if (currentElement !== null)
            controlParameterIndex = this.getControlParameterIndex(currentElement);
        if (controlParameterIndex === this.lastControlParameterIndex)
            return;
        this.lastControlParameterIndex = controlParameterIndex;
        window.__JUCE__.backend.emitEvent(JuceEvents.ControlParamaterIndexChanged, controlParameterIndex);
    }
    //==============================================================================
    getControlParameterIndex(element) {
        const isValidNonRootElement = (e) => {
            return e !== null && e !== document.documentElement;
        };
        while (isValidNonRootElement(element)) {
            if (element.hasAttribute(this.controlParameterIndexAnnotation)) {
                return Number(element.getAttribute(this.controlParameterIndexAnnotation));
            }
            element = element.parentElement;
        }
        return -1;
    }
}
//# sourceMappingURL=controlParameterIndexUpdater.js.map