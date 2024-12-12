import requests
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

jwt_token = os.getenv("PINATA_JWT_TOKEN")
gateway_token = os.getenv("GATEWAY_TOKEN")

def get_grid_objects(obj):
    grids = []
    for i in obj:
        gateway = f"https://teal-advanced-armadillo-537.mypinata.cloud/ipfs/{i}?pinataGatewayToken={gateway_token}"
        response = requests.request("GET",gateway)
        res = response.json()
        grids.append(res)
    return grids

def upload_to_pinata(jsonVal):
    grid = jsonVal["grid"]
    owner = jsonVal["owner"]
    with open(f"{owner}.json", "w") as json_file:
        json.dump(grid, json_file, indent=4)

    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    headers = {'Authorization': f'Bearer {jwt_token}'}

    with open(f"{owner}.json","rb") as file:
        response = requests.request("POST", url, files={'file': file}, headers=headers)
        res = response.json()
        
        return res["IpfsHash"]

def retrieve_grids_from_pinata(hash):
    url = "https://api.pinata.cloud/data/pinList"
    querystring = {"cid":hash,"groupId":"21604735-a9eb-4fb3-847d-af2a511cc112"}
    headers = {"Authorization": f"Bearer {jwt_token}"}
    response = requests.request("GET", url, headers=headers, params=querystring)
    res = response.json()
    count = res["count"]
    _ = res["rows"]
    arr = []
    for i in _:
        cid = _["ipfs_pin_hash"]
        obj = get_obj(cid)
        arr.append(obj)
    return arr

def add_to_group(hash):
    url = "https://api.pinata.cloud/groups/21604735-a9eb-4fb3-847d-af2a511cc112/cids"
    payload = {"cids": [hash]}
    headers = {
        "Authorization": f"Bearer {jwt_token}",
        "Content-Type": "application/json"
    }
    response = requests.request("PUT", url, json=payload, headers=headers)
    print(response.text)







