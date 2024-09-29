/**
 * Appends a platform-specific prefix to the path to ensure that a request sent to this address will
 * be received by the backend's ResourceProvider.
 * @param {String} path
 */
export function getBackendResourceAddress(path) {
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
//# sourceMappingURL=getBackendResourceAddress.js.map