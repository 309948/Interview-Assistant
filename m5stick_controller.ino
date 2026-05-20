#include <M5StickCPlus2.h>
#include <WiFi.h>
#include <HTTPClient.h>

// WiFi Configuration
const char* SSID = "YOUR_SSID";
const char* PASSWORD = "YOUR_PASSWORD";

// M5Stick Button GPIO pins
const uint8_t BTN_A_PIN = 37;
const uint8_t BTN_B_PIN = 39;

// Timing constants
const unsigned long SHORT_PRESS_DURATION = 500;   // ms
const unsigned long DEBOUNCE_DELAY = 50;          // ms

// Button state tracking
struct ButtonState {
  unsigned long press_start = 0;
  bool is_pressed = false;
  bool was_long_pressed = false;
};

ButtonState btn_a_state;
ButtonState btn_b_state;

String pc_ip = "";
unsigned long last_webhook_time = 0;
String last_action = "";

void setup() {
  M5.begin();
  
  // Configure button pins
  pinMode(BTN_A_PIN, INPUT_PULLUP);
  pinMode(BTN_B_PIN, INPUT_PULLUP);
  
  // Display initial message
  M5.Lcd.setTextSize(2);
  M5.Lcd.setRotation(0);
  M5.Lcd.fillScreen(BLACK);
  M5.Lcd.setCursor(0, 0);
  M5.Lcd.println("M5StickC+ Control");
  M5.Lcd.println("Connecting WiFi...");
  
  // Connect to WiFi
  connectToWiFi();
}

void loop() {
  M5.update();
  
  // Handle Button A
  handleButtonPress(BTN_A_PIN, btn_a_state, "A");
  
  // Handle Button B
  handleButtonPress(BTN_B_PIN, btn_b_state, "B");
  
  delay(10);
}

void connectToWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(SSID, PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    attempts++;
  }
  
  updateDisplay();
}

void handleButtonPress(uint8_t pin, ButtonState& state, const String& button_name) {
  bool current_state = !digitalRead(pin);  // Inverted because of INPUT_PULLUP
  
  if (current_state && !state.is_pressed) {
    // Button pressed
    state.is_pressed = true;
    state.press_start = millis();
    state.was_long_pressed = false;
  } 
  else if (current_state && state.is_pressed) {
    // Button still pressed
    unsigned long press_duration = millis() - state.press_start;
    if (press_duration >= SHORT_PRESS_DURATION && !state.was_long_pressed) {
      state.was_long_pressed = true;
      sendWebhookAction(button_name, "long");
      last_action = button_name + " long";
      updateDisplay();
    }
  } 
  else if (!current_state && state.is_pressed) {
    // Button released
    state.is_pressed = false;
    unsigned long press_duration = millis() - state.press_start;
    
    if (press_duration < SHORT_PRESS_DURATION && !state.was_long_pressed) {
      // Short press
      sendWebhookAction(button_name, "short");
      last_action = button_name + " short";
      updateDisplay();
    }
  }
}

void sendWebhookAction(const String& button, const String& press_type) {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }
  
  String action = "";
  if (button == "A" && press_type == "short") {
    action = "start_recording";
  } 
  else if (button == "B" && press_type == "short") {
    action = "ask_gpt";
  } 
  else if (button == "A" && press_type == "long") {
    action = "clear_content";
  } 
  else if (button == "B" && press_type == "long") {
    action = "clear_ai_result";
  }
  
  if (action == "") {
    return;
  }
  
  HTTPClient http;
  String webhook_url = "http://" + pc_ip + ":7878/webhook";
  
  http.begin(webhook_url);
  http.addHeader("Content-Type", "application/json");
  
  String payload = "{\"action\":\"" + action + "\"}";
  int http_code = http.POST(payload);
  
  if (http_code == 200) {
    last_webhook_time = millis();
  }
  
  http.end();
}

void updateDisplay() {
  M5.Lcd.fillScreen(BLACK);
  M5.Lcd.setTextSize(1);
  M5.Lcd.setCursor(0, 0);
  
  // WiFi status
  if (WiFi.status() == WL_CONNECTED) {
    M5.Lcd.print("WiFi: Connected");
    
    // Display IP address
    pc_ip = WiFi.gatewayIP().toString();
    M5.Lcd.setCursor(0, 10);
    M5.Lcd.print("Gateway IP:");
    M5.Lcd.setCursor(0, 20);
    M5.Lcd.print(pc_ip);
    
    // Display local IP
    M5.Lcd.setCursor(0, 30);
    M5.Lcd.print("Local IP:");
    M5.Lcd.setCursor(0, 40);
    M5.Lcd.print(WiFi.localIP().toString());
  } else {
    M5.Lcd.print("WiFi: Disconnected");
  }
  
  // Display last action
  M5.Lcd.setCursor(0, 50);
  M5.Lcd.print("Last action:");
  M5.Lcd.setCursor(0, 60);
  M5.Lcd.print(last_action);
  
  // Display webhook status
  unsigned long time_since_last = millis() - last_webhook_time;
  if (time_since_last < 1000) {
    M5.Lcd.setCursor(0, 70);
    M5.Lcd.print("Webhook: OK");
  }
}
