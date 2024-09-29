import { ListenerList } from "./eventListenerList";
import { JuceEvents } from "./events";

/**
 * ComboBoxState encapsulates data and callbacks that are synchronised with a WebComboBoxRelay object
 * on the backend.
 *
 * Use getComboBoxState() to create a ComboBoxState object. This object will be synchronised with the
 * WebComboBoxRelay backend object that was created using the same unique name.
 *
 * @param {String} name
 */
export class ComboBoxState {
  name: string;
  identifier: string;
  value: number;
  properties: {
    name: string;
    parameterIndex: number;
    choices: string[];
  };
  valueChangedEvent: ListenerList;
  propertiesChangedEvent: ListenerList;
  constructor(name: string) {
    if (!window.__JUCE__.initialisationData.__juce__comboBoxes.includes(name))
      console.warn(
        "Creating ComboBoxState for '" +
          name +
          "', which is unknown to the backend"
      );

    this.name = name;
    this.identifier = "__juce__comboBox" + this.name;
    this.value = 0.0;
    this.properties = {
      name: "",
      parameterIndex: -1,
      choices: [],
    };
    this.valueChangedEvent = new ListenerList();
    this.propertiesChangedEvent = new ListenerList();

    window.__JUCE__.backend.addEventListener(this.identifier, (event) =>
      this.handleEvent(event)
    );

    window.__JUCE__.backend.emitEvent(this.identifier, {
      eventType: "requestInitialUpdate",
    });
  }

  /**
   * Returns the value corresponding to the associated WebComboBoxRelay's (C++) state.
   *
   * This is an index identifying which element of the properties.choices array is currently
   * selected.
   */
  getChoiceIndex() {
    return Math.round(this.value * (this.properties.choices.length - 1));
  }

  /**
   * Informs the backend to change the associated WebComboBoxRelay's (C++) state.
   *
   * This should be called with the index identifying the selected element from the
   * properties.choices array.
   */
  setChoiceIndex(index) {
    const numItems = this.properties.choices.length;
    this.value = numItems > 1 ? index / (numItems - 1) : 0.0;

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
