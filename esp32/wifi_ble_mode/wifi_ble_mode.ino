#include <BLEDevice.h>
#include <BLEServer.h>

// BLE Service and Characteristic UUIDs
#define SERVICE_UUID        "12345678-1234-5678-1234-56789abcdef0"
#define CHARACTERISTIC_UUID "87654321-4321-6789-4321-fedcba987654"

void setup() {
 
  Serial.begin(115200);

  // Wi-Fi setup
  // BLE setup
  BLEDevice::init("ESP32 Device 1");
  BLEServer* pServer = BLEDevice::createServer();
  BLEService* pService = pServer->createService(SERVICE_UUID);
  pService->start();
  BLEDevice::getAdvertising()->start();
  Serial.println("BLE Advertising Started");
  
}

void loop() {
  Serial.println("ble connected");
  delay(10000);
}
