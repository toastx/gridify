from flask import Flask, jsonify,request
from bleak import BleakScanner
from flask_cors import CORS
from ipfs import *


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

@app.route("/post_grid",methods=["POST"])
async def post_grid():
    try:
        data = request.get_json()
        print(data)
        cid = upload_to_pinata(data)
        res = add_to_group(cid)
        return jsonify({
            "message": "Grid Created Successfully",
        }), 200
    
    except Exception as e:
        # Handle errors
        return jsonify({"error": str(e)}), 500

@app.route("/grids",methods=["GET"])
async def grids():
    grids = retrieve_grids_from_pinata()
    print(grids)
    grid_data = get_grid_objects(grids)
    
    return({
        "grids": grid_data,
    })


if __name__ == "__main__":
    app.run(debug=True)
