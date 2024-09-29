import { ListenerList } from "./eventListenerList";
import { JuceEvents } from "./events";

/**
 * SliderState encapsulates data and callbacks that are synchronised with a WebSliderRelay object
 * on the backend.
 *
 * Use getSliderState() to create a SliderState object. This object will be synchronised with the
 * WebSliderRelay backend object that was created using the same unique name.
 *
 * @param {String} name
 */
export class SliderState {
  name: string;
  identifier: string;
  scaledValue: number;
  properties: {
    start: number;
    end: number;
    skew: number;
    name: string;
    label: string;
    numSteps: number;
    interval: number;
    parameterIndex: number;
  };
  valueChangedEvent: ListenerList;
  propertiesChangedEvent: ListenerList;
  constructor(name: string) {
    if (!window.__JUCE__.initialisationData.__juce__sliders.includes(name))
      console.warn(
        "Creating SliderState for '" +
          name +
          "', which is unknown to the backend"
      );

    this.name = name;
    this.identifier = "__juce__slider" + this.name;
    this.scaledValue = 0;
    this.properties = {
      start: 0,
      end: 1,
      skew: 1,
      name: "",
      label: "",
      numSteps: 100,
      interval: 0,
      parameterIndex: -1,
    };
    this.valueChangedEvent = new ListenerList();
    this.propertiesChangedEvent = new ListenerList();

    window.__JUCE__.backend.addEventListener(this.identifier, (event) =>
      this.handleEvent(event)
    );

    window.__JUCE__.backend.emitEvent(this.identifier, {
      eventType: JuceEvents.RequestInitialUpdate,
    });
  }

  /**
   * Sets the normalised value of the corresponding backend parameter. This value is always in the
   * [0, 1] range (inclusive).
   *
   * The meaning of this range is the same as in the case of
   * AudioProcessorParameter::getValue() (C++).
   *
   * @param {number} newValue
   */
  setNormalisedValue(newValue: number) {
    this.scaledValue = this.snapToLegalValue(
      this.normalisedToScaledValue(newValue)
    );

    window.__JUCE__.backend.emitEvent(this.identifier, {
      eventType: JuceEvents.ControlValueChanged,
      value: this.scaledValue,
    });
  }

  /**
   * This function should be called first thing when the user starts interacting with the slider.
   */
  sliderDragStarted() {
    window.__JUCE__.backend.emitEvent(this.identifier, {
      eventType: JuceEvents.SliderDragStarted,
    });
  }

  /**
   * This function should be called when the user finished the interaction with the slider.
   */
  sliderDragEnded() {
    window.__JUCE__.backend.emitEvent(this.identifier, {
      eventType: JuceEvents.SliderDragEnded,
    });
  }

  /** Internal. */
  handleEvent(event) {
    if (event.eventType == JuceEvents.ControlValueChanged) {
      this.scaledValue = event.value;
      this.valueChangedEvent.callListeners();
    }
    if (event.eventType == JuceEvents.ControlPropertiesChanged) {
      // eslint-disable-next-line no-unused-vars
      let { eventType: _, ...rest } = event;
      this.properties = rest;
      this.propertiesChangedEvent.callListeners();
    }
  }

  /**
   * Returns the scaled value of the parameter. This corresponds to the return value of
   * NormalisableRange::convertFrom0to1() (C++). This value will differ from a linear
   * [0, 1] range if a non-default NormalisableRange was set for the parameter.
   */
  getScaledValue() {
    return this.scaledValue;
  }

  /**
   * Returns the normalised value of the corresponding backend parameter. This value is always in the
   * [0, 1] range (inclusive).
   *
   * The meaning of this range is the same as in the case of
   * AudioProcessorParameter::getValue() (C++).
   *
   * @param {String} name
   */
  getNormalisedValue() {
    return Math.pow(
      (this.scaledValue - this.properties.start) /
        (this.properties.end - this.properties.start),
      this.properties.skew
    );
  }

  /** Internal. */
  private normalisedToScaledValue(normalisedValue) {
    return (
      Math.pow(normalisedValue, 1 / this.properties.skew) *
        (this.properties.end - this.properties.start) +
      this.properties.start
    );
  }

  /** Internal. */
  private snapToLegalValue(value) {
    const interval = this.properties.interval;

    if (interval == 0) return value;

    const start = this.properties.start;
    const clamp = (val, min = 0, max = 1) => Math.max(min, Math.min(max, val));

    return clamp(
      start + interval * Math.floor((value - start) / interval + 0.5),
      this.properties.start,
      this.properties.end
    );
  }
}
