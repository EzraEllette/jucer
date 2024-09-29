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
import { Backend } from "./backend";
export function checkNativeInterops() {
    if (typeof window.__JUCE__ !== "undefined" &&
        typeof window.__JUCE__.getAndroidUserScripts !== "undefined" &&
        typeof window.inAndroidUserScriptEval === "undefined") {
        window.inAndroidUserScriptEval = true;
        eval(window.__JUCE__.getAndroidUserScripts());
        delete window.inAndroidUserScriptEval;
    }
    {
        if (typeof window.__JUCE__ === "undefined") {
            console.warn("The 'window.__JUCE__' object is undefined." +
                " Native integration features will not work." +
                " Defining a placeholder 'window.__JUCE__' object.");
            window.__JUCE__ = {
                postMessage: function () { },
                getAndroidUserScripts: function () {
                    return "";
                },
                backend: new Backend(),
            };
        }
        if (typeof window.__JUCE__.initialisationData === "undefined") {
            window.__JUCE__.initialisationData = {
                __juce__platform: [],
                __juce__functions: [],
                __juce__registeredGlobalEventIds: [],
                __juce__sliders: [],
                __juce__toggles: [],
                __juce__comboBoxes: [],
            };
        }
        if (typeof window.__JUCE__.backend === "undefined")
            window.__JUCE__.backend = new Backend();
    }
}
//# sourceMappingURL=checkNativeInterops.js.map