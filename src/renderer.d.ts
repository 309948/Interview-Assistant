export interface ElectronAPI {
  saveTempAudioFile(audioEncoded: ArrayBuffer): unknown;
  transcribeAudioFile(tempFilePath: any, arg1: { primaryLanguage: string; secondaryLanguage: string; api_base: any; openai_key: any; }): TranscriptionResult | PromiseLike<TranscriptionResult>;
  getConfig: () => Promise<any>;
  setConfig: (config: any) => Promise<void>;
  testAPIConfig: (config: any) => Promise<{ success: boolean, error?: string }>;
  startRecording: () => Promise<Array<{id: string, name: string, thumbnail: string}>>;
  parsePDF: (pdfBuffer: ArrayBuffer) => Promise<{ text: string, error?: string }>;
  processImage: (imagePath: string) => Promise<string>;
  highlightCode: (code: string, language: string) => Promise<string>;
  getSystemAudioStream: () => Promise<string[]>;
  callOpenAI: (params: {
    config: any;
    messages: any[];
    signal?: AbortSignal;
  }) => Promise<{ content: string } | { error: string }>;
  transcribeAudio: (audioBuffer: ArrayBuffer, config: any) => Promise<TranscriptionResult>;
  startDeepgram: (config: { deepgram_key: string; primaryLanguage?: string }) => Promise<{ success: boolean; error?: string }>;
  sendAudioToDeepgram: (audioBuffer: ArrayBuffer) => Promise<void>;
  stopDeepgram: () => Promise<void>;
  onDeepgramTranscript: (listener: (data: any) => void) => () => void;
  onDeepgramStatus: (listener: (data: any) => void) => () => void;
  onDeepgramError: (listener: (data: any) => void) => () => void;
  connectM5Bluetooth: () => Promise<{ success: boolean; error?: string; deviceName?: string }>;
  disconnectM5Bluetooth: () => Promise<{ success: boolean }>;
  getM5BluetoothStatus: () => Promise<{ connected: boolean; deviceName?: string }>;
  onM5Action: (listener: (action: string) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

declare global {
  interface MediaTrackConstraintSet {
    chromeMediaSource?: string;
    mandatory?: {
      chromeMediaSource?: string;
      chromeMediaSourceId?: string;
    };
  }
}
