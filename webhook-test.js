/**
 * Webhook Test Script
 * Tests the M5 webhook server implementation
 */

const http = require('http');

const WEBHOOK_HOST = '127.0.0.1';
const WEBHOOK_PORT = 7878;

const testActions = [
  'start_recording',
  'ask_gpt',
  'clear_content',
  'clear_ai_result'
];

function makeWebhookRequest(action) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ action });

    const options = {
      hostname: WEBHOOK_HOST,
      port: WEBHOOK_PORT,
      path: '/webhook',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          action,
          response: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 M5 Webhook Server Test Suite\n');
  console.log(`Target: http://${WEBHOOK_HOST}:${WEBHOOK_PORT}/webhook\n`);

  // Test 1: Valid actions
  console.log('Test 1: Valid webhook actions');
  console.log('─'.repeat(50));
  for (const action of testActions) {
    try {
      const result = await makeWebhookRequest(action);
      const passed = result.status === 200;
      const icon = passed ? '✅' : '❌';
      console.log(`${icon} Action "${action}": ${result.status} - ${result.response}`);
    } catch (err) {
      console.log(`❌ Action "${action}": Connection failed - ${err.message}`);
    }
  }

  // Test 2: Invalid action
  console.log('\nTest 2: Invalid action (should return 400)');
  console.log('─'.repeat(50));
  try {
    const result = await makeWebhookRequest('invalid_action');
    const icon = result.status === 400 ? '✅' : '❌';
    console.log(`${icon} Invalid action: ${result.status} - ${result.response}`);
  } catch (err) {
    console.log(`❌ Failed: ${err.message}`);
  }

  // Test 3: Invalid JSON
  console.log('\nTest 3: Invalid JSON (should return 400)');
  console.log('─'.repeat(50));
  try {
    const invalidPayload = 'not valid json';
    const options = {
      hostname: WEBHOOK_HOST,
      port: WEBHOOK_PORT,
      path: '/webhook',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(invalidPayload)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const icon = res.statusCode === 400 ? '✅' : '❌';
        console.log(`${icon} Invalid JSON: ${res.statusCode} - ${data}`);
      });
    });

    req.write(invalidPayload);
    req.end();
  } catch (err) {
    console.log(`❌ Failed: ${err.message}`);
  }

  // Test 4: Wrong endpoint
  console.log('\nTest 4: Wrong endpoint (should return 404)');
  console.log('─'.repeat(50));
  try {
    const payload = JSON.stringify({ action: 'start_recording' });
    const options = {
      hostname: WEBHOOK_HOST,
      port: WEBHOOK_PORT,
      path: '/wrong',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const icon = res.statusCode === 404 ? '✅' : '❌';
        console.log(`${icon} Wrong endpoint: ${res.statusCode} - ${data}`);
      });
    });

    req.write(payload);
    req.end();
  } catch (err) {
    console.log(`❌ Failed: ${err.message}`);
  }

  console.log('\n' + '─'.repeat(50));
  console.log('✨ Tests completed!\n');
  console.log('IMPORTANT: Make sure the Electron app is running with M5 webhook enabled');
}

runTests().catch(console.error);
