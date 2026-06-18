import React, { useState, useEffect } from 'react';
import { useError } from '../contexts/ErrorContext';
import ErrorDisplay from '../components/ErrorDisplay';
import { languageOptions } from '../utils/languageOptions';

const Settings: React.FC = () => {
  const { error, setError, clearError } = useError();
  const [apiKey, setApiKey] = useState('');
  const [apiBase, setApiBase] = useState('');
  const [apiModel, setApiModel] = useState('gpt-4o');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [apiCallMethod, setApiCallMethod] = useState<'direct' | 'proxy'>('direct');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [primaryLanguage, setPrimaryLanguage] = useState('auto');
  const [secondaryLanguage, setSecondaryLanguage] = useState('');
  const [deepgramApiKey, setDeepgramApiKey] = useState('');
  const [m5Connected, setM5Connected] = useState(false);
  const [m5DeviceName, setM5DeviceName] = useState('');
  const [m5Connecting, setM5Connecting] = useState(false);
  const [m5StatusMessage, setM5StatusMessage] = useState('');

  useEffect(() => {
    loadConfig();
    loadM5BluetoothStatus();
  }, []);

  const loadConfig = async () => {
    try {
      const config = await window.electronAPI.getConfig();
      setApiKey(config.openai_key || '');
      setApiModel(config.gpt_model || 'gpt-4o');
      setApiBase(config.api_base || '');
      setApiCallMethod(config.api_call_method || 'direct');
      setPrimaryLanguage(config.primaryLanguage || 'auto');
      setSecondaryLanguage(config.secondaryLanguage || '');
      setDeepgramApiKey(config.deepgram_api_key || '');
    } catch (err) {
      console.error('Failed to load configuration', err);
      setError('Failed to load configuration. Please check your settings.');
    }
  };

  const loadM5BluetoothStatus = async () => {
    try {
      const status = await window.electronAPI.getM5BluetoothStatus();
      setM5Connected(status.connected);
      setM5DeviceName(status.deviceName || '');
    } catch (err) {
      console.error('Failed to load M5 bluetooth status', err);
    }
  };

  const handleM5BluetoothToggle = async () => {
    try {
      if (m5Connected) {
        await window.electronAPI.disconnectM5Bluetooth();
        setM5Connected(false);
        setM5DeviceName('');
        setM5StatusMessage('M5 disconnected');
        setTimeout(() => setM5StatusMessage(''), 3000);
      } else {
        setM5Connecting(true);
        const result = await window.electronAPI.connectM5Bluetooth();
        setM5Connecting(false);
        if (result.success) {
          setM5Connected(true);
          setM5DeviceName(result.deviceName || 'M5-Controller');
          setM5StatusMessage('M5 connected');
          setTimeout(() => setM5StatusMessage(''), 3000);
        } else {
          setM5StatusMessage(`Failed to connect: ${result.error}`);
        }
      }
    } catch (err) {
      setM5Connecting(false);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setM5StatusMessage(`Error: ${errorMessage}`);
    }
  };

  const handleSave = async () => {
    try {
      await window.electronAPI.setConfig({
        openai_key: apiKey,
        gpt_model: apiModel,
        api_base: apiBase,
        api_call_method: apiCallMethod,
        primaryLanguage: primaryLanguage,
        deepgram_api_key: deepgramApiKey,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save configuration');
    }
  };

  const testAPIConfig = async () => {
    try {
      setTestResult('Testing...');
      console.log('Sending test-api-config request with config:', {
        openai_key: apiKey,
        gpt_model: apiModel,
        api_base: apiBase,
      });
      const result = await window.electronAPI.testAPIConfig({
        openai_key: apiKey,
        gpt_model: apiModel,
        api_base: apiBase,
      });
      console.log('Received test-api-config result:', result);
      if (result.success) {
        setTestResult('API configuration is valid!');
      } else {
        setTestResult(`API configuration test failed: ${result.error || 'Unknown error'}`);
        setError(`Failed to test API configuration: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('API configuration test error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setTestResult(`API configuration test failed: ${errorMessage}`);
      setError(`Failed to test API configuration: ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <ErrorDisplay error={error} onClose={clearError} />
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="mb-4">
        <label className="label">API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>
      <div className="mb-4">
        <label className="label">API Base URL (Optional)</label>
        <input
          type="text"
          value={apiBase}
          onChange={(e) => setApiBase(e.target.value)}
          className="input input-bordered w-full"
        />
        <label className="label">
          <span className="label-text-alt">
            Enter proxy URL if using API proxy. For example: https://your-proxy.com/v1
          </span>
        </label>
      </div>
      <div className="mb-4">
        <label className="label">API Model</label>
        <input
          type="text"
          value={apiModel}
          onChange={(e) => setApiModel(e.target.value)}
          className="input input-bordered w-full"
        />
        <label className="label">
          <span className="label-text-alt">Please use a model supported by your API. Preferably gpt-4.</span>
        </label>
      </div>
      <div className="mb-4">
        <label className="label">API Call Method</label>
        <select
          value={apiCallMethod}
          onChange={(e) => setApiCallMethod(e.target.value as 'direct' | 'proxy')}
          className="select select-bordered w-full"
        >
          <option value="direct">Direct</option>
          <option value="proxy">Proxy</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="label">Deepgram API Key</label>
        <input
          type="password"
          value={deepgramApiKey}
          onChange={(e) => setDeepgramApiKey(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>
      <div className="mb-4">
        <label className="label">Primary Language</label>
        <select
          value={primaryLanguage}
          onChange={(e) => setPrimaryLanguage(e.target.value)}
          className="select select-bordered w-full"
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="divider my-6"></div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">M5StickC Control</h2>
        <div className="card bg-base-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleM5BluetoothToggle}
              disabled={m5Connecting}
              className={`btn btn-sm ${m5Connected ? 'btn-error' : 'btn-primary'}`}
            >
              {m5Connecting ? 'Connecting...' : m5Connected ? 'Disconnect' : 'Connect M5 (Bluetooth)'}
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${m5Connected ? 'bg-success' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">{m5Connected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>

          {m5Connected && (
            <div className="mb-4 p-3 bg-info/20 rounded">
              <p className="text-sm text-info">
                <strong>Device:</strong> {m5DeviceName || 'M5-Controller'}
              </p>
            </div>
          )}

          {m5StatusMessage && (
            <p className={`text-sm mb-4 ${m5StatusMessage.includes('connected') || m5StatusMessage.includes('disconnected') ? 'text-success' : 'text-error'}`}>
              {m5StatusMessage}
            </p>
          )}

          <p className="text-xs text-gray-500 mb-4">
            M5StickC Plus2 debe estar encendido y advirtiendo BLE como "M5-Controller". Al pulsar "Connect" Electron escaneara y emparejara automaticamente.
          </p>

          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="bg-base-300">
                  <th>Button</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Button A (short press)</td>
                  <td>Start / Stop Recording</td>
                </tr>
                <tr className="bg-base-100">
                  <td>Button B (short press)</td>
                  <td>Ask GPT</td>
                </tr>
                <tr>
                  <td>Button A (long press)</td>
                  <td>Clear Content</td>
                </tr>
                <tr className="bg-base-100">
                  <td>Button B (long press)</td>
                  <td>Clear AI Result</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={handleSave} className="btn btn-primary">
          Save Settings
        </button>
        <button onClick={testAPIConfig} className="btn btn-secondary">
          Test API Configuration
        </button>
      </div>
      {saveSuccess && <p className="text-success mt-2">Settings saved successfully</p>}
      {testResult && <p className={`mt-2 ${testResult.includes('valid') ? 'text-success' : 'text-error'}`}>{testResult}</p>}
    </div>
  );
};

export default Settings;
