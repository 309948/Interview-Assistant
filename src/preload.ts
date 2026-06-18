import { contextBridge, ipcRenderer } from 'electron';

// ── M5StickC Plus2 BLE bridge ───────────────────────────────────────────
// Matches the GATT service/characteristic advertised by the M5-BlueSignal
// firmware (src/main.cpp: SERVICE_UUID / CHAR_UUID / DEVICE_NAME).
const M5_SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
const M5_CHAR_UUID = 'abcdefab-1234-1234-1234-abcdefabcdef';
const ALLOWED_M5_ACTIONS = ['start_recording', 'ask_gpt', 'clear_content', 'clear_ai_result'];

let bleDevice: any = null;
let bleCharacteristic: any = null;
const m5ActionListeners = new Set<(action: string) => void>();

function handleM5Notification(event: Event) {
  const characteristic = event.target as any;
  const value = characteristic.value as DataView | undefined;
  if (!value) return;
  const action = new TextDecoder().decode(value.buffer);
  if (ALLOWED_M5_ACTIONS.includes(action)) {
    m5ActionListeners.forEach((listener) => listener(action));
  }
}

async function connectM5Bluetooth(): Promise<{ success: boolean; error?: string; deviceName?: string }> {
  try {
    const bluetooth = (navigator as any).bluetooth;
    if (!bluetooth) {
      return { success: false, error: 'Web Bluetooth not available in this build' };
    }
    bleDevice = await bluetooth.requestDevice({
      filters: [{ services: [M5_SERVICE_UUID] }, { name: 'M5-Controller' }],
      optionalServices: [M5_SERVICE_UUID],
    });
    bleDevice.addEventListener('gattserverdisconnected', () => {
      bleCharacteristic = null;
    });
    const server = await bleDevice.gatt.connect();
    const service = await server.getPrimaryService(M5_SERVICE_UUID);
    bleCharacteristic = await service.getCharacteristic(M5_CHAR_UUID);
    await bleCharacteristic.startNotifications();
    bleCharacteristic.addEventListener('characteristicvaluechanged', handleM5Notification);
    return { success: true, deviceName: bleDevice.name };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function disconnectM5Bluetooth(): Promise<{ success: boolean }> {
  if (bleCharacteristic) {
    bleCharacteristic.removeEventListener('characteristicvaluechanged', handleM5Notification);
    bleCharacteristic = null;
  }
  if (bleDevice?.gatt?.connected) {
    bleDevice.gatt.disconnect();
  }
  bleDevice = null;
  return { success: true };
}

function getM5BluetoothStatus() {
  return {
    connected: Boolean(bleDevice?.gatt?.connected),
    deviceName: bleDevice?.name as string | undefined,
  };
}

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: () => ipcRenderer.invoke('get-config'),
  setConfig: (config: any) => ipcRenderer.invoke('set-config', config),
  testAPIConfig: (config: any) => ipcRenderer.invoke('test-api-config', config),
  parsePDF: (buffer: ArrayBuffer) => ipcRenderer.invoke('parsePDF', buffer),
  processImage: (path: string) => ipcRenderer.invoke('process-image', path),
  highlightCode: (code: string, language: string) => ipcRenderer.invoke('highlightCode', code, language),
  callOpenAI: (params: any) => ipcRenderer.invoke('callOpenAI', params),
  getSystemAudioStream: () => ipcRenderer.invoke('get-system-audio-stream'),
  transcribeAudioFile: (filePath: string, config: any) => ipcRenderer.invoke('transcribe-audio-file', filePath, config),
  saveTempAudioFile: (audioBuffer: ArrayBuffer) => ipcRenderer.invoke('save-temp-audio-file', audioBuffer),
  transcribeAudio: (audioBuffer: ArrayBuffer, config: any) => ipcRenderer.invoke('transcribe-audio', audioBuffer, config),
  startDeepgram: (config: { deepgram_key: string; primaryLanguage?: string }) => ipcRenderer.invoke('start-deepgram', config),
  sendAudioToDeepgram: (audioBuffer: ArrayBuffer) => ipcRenderer.invoke('send-audio-to-deepgram', audioBuffer),
  stopDeepgram: () => ipcRenderer.invoke('stop-deepgram'),
  onDeepgramTranscript: (listener: (data: any) => void) => {
    const wrappedListener = (_event: Electron.IpcRendererEvent, data: any) => listener(data);
    ipcRenderer.on('deepgram-transcript', wrappedListener);
    return () => ipcRenderer.removeListener('deepgram-transcript', wrappedListener);
  },
  onDeepgramStatus: (listener: (data: any) => void) => {
    const wrappedListener = (_event: Electron.IpcRendererEvent, data: any) => listener(data);
    ipcRenderer.on('deepgram-status', wrappedListener);
    return () => ipcRenderer.removeListener('deepgram-status', wrappedListener);
  },
  onDeepgramError: (listener: (data: any) => void) => {
    const wrappedListener = (_event: Electron.IpcRendererEvent, data: any) => listener(data);
    ipcRenderer.on('deepgram-error', wrappedListener);
    return () => ipcRenderer.removeListener('deepgram-error', wrappedListener);
  },
  connectM5Bluetooth: () => connectM5Bluetooth(),
  disconnectM5Bluetooth: () => disconnectM5Bluetooth(),
  getM5BluetoothStatus: () => getM5BluetoothStatus(),
  onM5Action: (listener: (action: string) => void) => {
    m5ActionListeners.add(listener);
    return () => m5ActionListeners.delete(listener);
  },
});
