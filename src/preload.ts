import { contextBridge, ipcRenderer } from 'electron';

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
});
