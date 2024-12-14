from flask import Flask, jsonify,request
from bleak import BleakScanner
from flask_cors import CORS
from ipfs import *


app = Flask(__name__)
CORS(app)

grid_group = "21604735-a9eb-4fb3-847d-af2a511cc112"
device_group = "01bc70d5-a1ac-48fc-862a-0b4e03a3fdbd"

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

@app.route("/post_grid",methods=["POST"])
async def post_grid():
    try:
        jsonVal = request.get_json()
        grid = jsonVal["grid"]
        owner = jsonVal["owner"]
        cid = upload_to_pinata(grid,owner)
        res = add_to_group(cid,grid_group)
        return jsonify({
            "message": "Grid Created Successfully",
        }), 200
    
    except Exception as e:
        # Handle errors
        return jsonify({"error": str(e)}), 500

@app.route("/grids",methods=["GET"])
async def grids():
    grids = retrieve_from_pinata(grid_group)
    print(grids)
    grid_data = get_objects(grids)
    
    return({
        "grids": grid_data,
    })

@app.route("/post_device",methods=["POST"])
async def post_device():
    try:
        jsonVal = request.get_json()
        device = jsonVal["new_device"]
        key = jsonVal["new_device_key"]
        cid = upload_to_pinata(device,key)
        res = add_to_group(cid,device_group)
        return jsonify({
            "message": "Device Registered Successfully",
        }), 200
    
    except Exception as e:
        # Handle errors
        return jsonify({"error": str(e)}), 500
    
@app.route("/devices",methods=["GET"])
async def devices():
    devices = retrieve_from_pinata(device_group)
    device_data = get_objects(devices)
    return({
        "devices": device_data,
    })

if __name__ == "__main__":
    app.run(debug=True)
