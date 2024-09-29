/*
  ==============================================================================

   This file is part of the JUCE framework.
   Copyright (c) Raw Material Software Limited

   JUCE is an open source framework subject to commercial or open source
   licensing.

   By downloading, installing, or using the JUCE framework, or combining the
   JUCE framework with any other source code, object code, content or any other
   copyrightable work, you agree to the terms of the JUCE End User Licence
   Agreement, and all incorporated terms including the JUCE Privacy Policy and
   the JUCE Website Terms of Service, as applicable, which will bind you. If you
   do not agree to the terms of these agreements, we will not license the JUCE
   framework to you, and you must discontinue the installation or download
   process and cease use of the JUCE framework.

   JUCE End User Licence Agreement: https://juce.com/legal/juce-8-licence/
   JUCE Privacy Policy: https://juce.com/juce-privacy-policy
   JUCE Website Terms of Service: https://juce.com/juce-website-terms-of-service/

   Or:

   You may also use this code under the terms of the AGPLv3:
   https://www.gnu.org/licenses/agpl-3.0.en.html

   THE JUCE FRAMEWORK IS PROVIDED "AS IS" WITHOUT ANY WARRANTY, AND ALL
   WARRANTIES, WHETHER EXPRESSED OR IMPLIED, INCLUDING WARRANTY OF
   MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE, ARE DISCLAIMED.

  ==============================================================================
*/
import { checkNativeInterops } from "./checkNativeInterops";
import { ComboBoxState } from "./comboBoxState";
import { ControlParameterIndexUpdater } from "./controlParameterIndexUpdater";
import { JuceEvents } from "./events";
import { PromiseHandler } from "./promiseHandler";
import { SliderState } from "./sliderState";
import { ToggleState } from "./toggleState";
export { JuceEvents, ControlParameterIndexUpdater };
class Jucer {
    sliderStates;
    toggleStates;
    comboBoxStates;
    //@ts-ignore no-unused-vars
    promiseHandler;
    constructor() {
        if (!window)
            throw new Error("Jucer must be initialised from within a browser environment");
        checkNativeInterops();
        this.sliderStates = new Map();
        this.toggleStates = new Map();
        this.comboBoxStates = new Map();
        this.promiseHandler = new PromiseHandler();
        for (const name of window.__JUCE__.initialisationData.__juce__toggles)
            this.toggleStates.set(name, new ToggleState(name));
        for (const sliderName of window.__JUCE__.initialisationData.__juce__sliders)
            this.sliderStates.set(sliderName, new SliderState(sliderName));
        for (const name of window.__JUCE__.initialisationData.__juce__comboBoxes)
            this.comboBoxStates.set(name, new ComboBoxState(name));
    }
    /**
     * Returns a SliderState object that is connected to the backend WebSliderRelay object that was
     * created with the same name argument.
     *
     * To register a WebSliderRelay object create one with the right name and add it to the
     * WebBrowserComponent::Options struct using withOptionsFrom.
     *
     * @param {String} name
     */
    getSliderState(name) {
        if (!this.sliderStates.has(name))
            this.sliderStates.set(name, new SliderState(name));
        return this.sliderStates.get(name);
    }
    /**
     * Returns a ToggleState object that is connected to the backend WebToggleButtonRelay object that was
     * created with the same name argument.
     *
     * To register a WebToggleButtonRelay object create one with the right name and add it to the
     * WebBrowserComponent::Options struct using withOptionsFrom.
     *
     * @param {String} name
     */
    getToggleState(name) {
        if (!this.toggleStates.has(name))
            this.toggleStates.set(name, new ToggleState(name));
        return this.toggleStates.get(name);
    }
    /**
     * Returns a ComboBoxState object that is connected to the backend WebComboBoxRelay object that was
     * created with the same name argument.
     *
     * To register a WebComboBoxRelay object create one with the right name and add it to the
     * WebBrowserComponent::Options struct using withOptionsFrom.
     *
     * @param {String} name
     */
    getComboBoxState(name) {
        if (!this.comboBoxStates.has(name))
            this.comboBoxStates.set(name, new ComboBoxState(name));
        return this.comboBoxStates.get(name);
    }
    /**
     * Returns a function object that calls a function registered on the JUCE backend and forwards all
     * parameters to it.
     *
     * The provided name should be the same as the name argument passed to
     * WebBrowserComponent::Options.withNativeFunction() on the backend.
     *
     * @param {String} name
     */
    getNativeFunction(name) {
        if (!window.__JUCE__.initialisationData.__juce__functions.includes(name))
            console.warn(`Creating native function binding for '${name}', which is unknown to the backend`);
        const f = function () {
            const [promiseId, result] = this.promiseHandler.createPromise();
            window.__JUCE__.backend.emitEvent(JuceEvents.Invoke, {
                name: name,
                params: Array.prototype.slice.call(arguments),
                resultId: promiseId,
            });
            return result;
        };
        return f;
    }
    /**
     * Appends a platform-specific prefix to the path to ensure that a request sent to this address will
     * be received by the backend's ResourceProvider.
     * @param {String} path
     */
    getBackendResourceAddress(path) {
        const platform = window.__JUCE__.initialisationData.__juce__platform.length > 0
            ? window.__JUCE__.initialisationData.__juce__platform[0]
            : "";
        if (platform == "windows" || platform == "android")
            return "https://juce.backend/" + path;
        if (platform == "macos" || platform == "ios" || platform == "linux")
            return "juce://juce.backend/" + path;
        console.warn("getBackendResourceAddress() called, but no JUCE native backend is detected.");
        return path;
    }
}
//# sourceMappingURL=index.js.map