from flask import Flask, jsonify
from bleak import BleakScanner
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

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
