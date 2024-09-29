export {};

declare global {
  interface Window {
    __JUCE__: {
      backend: any;
      postMessage: (message: string) => void;
      getAndroidUserScripts?: () => string;
      initialisationData?: {
        __juce__platform: any;
        __juce__functions: any;
        __juce__registeredGlobalEventIds: any;
        __juce__sliders: any;
        __juce__toggles: any;
        __juce__comboBoxes: any;
      };
    };
    inAndroidUserScriptEval?: boolean;
  }
}
