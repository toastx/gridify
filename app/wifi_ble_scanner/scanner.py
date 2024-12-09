from flask import Flask, jsonify,logging
import asyncio
from bleak import BleakScanner
from scapy.all import sniff


app = Flask(__name__)


# Wi-Fi devices global cache
wifi_devices = []

# Wi-Fi scanning function
def detect_wifi_devices(packet):
    
    global wifi_devices
    if packet.haslayer("IP"):
        
        if packet.haslayer("UDP"):
            print(packet["UDP"].summary())
            mac_address = packet.addr2
            ssid = packet.info.decode("utf-8", errors="ignore") if packet.info else "Hidden SSID"
            if mac_address:
                wifi_devices.append({"mac": mac_address, "ssid": ssid})
        else:
            print("No mac address found")


@app.route("/wifi", methods=["GET"])
def get_wifi_devices():
    """
    API endpoint to get Wi-Fi devices.
    """
    print("asdasdasdasdasd")
    global wifi_devices
    wifi_devices.clear()  # Clear cache before scanning
    try:
        sniff(prn=detect_wifi_devices, iface="Wi-Fi", timeout=10, count=0)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify({"wifi_devices": wifi_devices})


@app.route("/ble", methods=["GET"])
async def get_ble_devices():
    """
    API endpoint to get BLE devices.
    
    """
    try:
        
        devices = await get_ble_devices_async()
        
        ble_devices = [{"name": device.name, "address": device.address} for device in devices]
        print(ble_devices)
        
        return jsonify({"ble_devices": ble_devices})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

async def get_ble_devices_async():
    devices = await BleakScanner.discover()
    return devices

if __name__ == "__main__":
    app.run(debug=True)
