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
import "./checkNativeInterops";
import { ComboBoxState } from "./comboBoxState";
import { ControlParameterIndexUpdater } from "./controlParameterIndexUpdater";
import { getBackendResourceAddress } from "./getBackendResourceAddress";
import { getNativeFunction } from "./getNativeFunction";
import { SliderState } from "./sliderState";
import { ToggleState } from "./toggleState";
const sliderStates = new Map();
for (const sliderName of window.__JUCE__.initialisationData.__juce__sliders)
    sliderStates.set(sliderName, new SliderState(sliderName));
/**
 * Returns a SliderState object that is connected to the backend WebSliderRelay object that was
 * created with the same name argument.
 *
 * To register a WebSliderRelay object create one with the right name and add it to the
 * WebBrowserComponent::Options struct using withOptionsFrom.
 *
 * @param {String} name
 */
function getSliderState(name) {
    if (!sliderStates.has(name))
        sliderStates.set(name, new SliderState(name));
    return sliderStates.get(name);
}
const toggleStates = new Map();
for (const name of window.__JUCE__.initialisationData.__juce__toggles)
    toggleStates.set(name, new ToggleState(name));
/**
 * Returns a ToggleState object that is connected to the backend WebToggleButtonRelay object that was
 * created with the same name argument.
 *
 * To register a WebToggleButtonRelay object create one with the right name and add it to the
 * WebBrowserComponent::Options struct using withOptionsFrom.
 *
 * @param {String} name
 */
function getToggleState(name) {
    if (!toggleStates.has(name))
        toggleStates.set(name, new ToggleState(name));
    return toggleStates.get(name);
}
const comboBoxStates = new Map();
for (const name of window.__JUCE__.initialisationData.__juce__comboBoxes)
    comboBoxStates.set(name, new ComboBoxState(name));
/**
 * Returns a ComboBoxState object that is connected to the backend WebComboBoxRelay object that was
 * created with the same name argument.
 *
 * To register a WebComboBoxRelay object create one with the right name and add it to the
 * WebBrowserComponent::Options struct using withOptionsFrom.
 *
 * @param {String} name
 */
function getComboBoxState(name) {
    if (!comboBoxStates.has(name))
        comboBoxStates.set(name, new ComboBoxState(name));
    return comboBoxStates.get(name);
}
export { getNativeFunction, getSliderState, getToggleState, getComboBoxState, getBackendResourceAddress, ControlParameterIndexUpdater, };
//# sourceMappingURL=index.js.map