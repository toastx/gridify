import requests
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

jwt_token = os.getenv("PINATA_JWT_TOKEN")
gateway_token = os.getenv("GATEWAY_TOKEN")

def get_objects(obj):
    objs = []
    for i in obj:
        gateway = f"https://teal-advanced-armadillo-537.mypinata.cloud/ipfs/{i}?pinataGatewayToken={gateway_token}"
        response = requests.request("GET",gateway)
        res = response.json()
        res["status"] = "active"
        objs.append(res)
    return objs

def upload_to_pinata(grid,owner):
    with open(f"{owner}.json", "w") as json_file:
        json.dump(grid, json_file, indent=4)
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    headers = {'Authorization': f'Bearer {jwt_token}'}
    with open(f"{owner}.json","rb") as file:
        response = requests.request("POST", url, files={'file': file}, headers=headers)
        res = response.json()
        
        return res["IpfsHash"]


def retrieve_from_pinata(gID):
    url = "https://api.pinata.cloud/data/pinList"
    querystring = {"groupId":gID}
    headers = {"Authorization": f"Bearer {jwt_token}"}
    response = requests.request("GET", url, headers=headers, params=querystring)
    res = response.json()
    count = res["count"]
    _ = res["rows"]
    arr = []
    for i in _:
        cid = i["ipfs_pin_hash"]
        arr.append(cid)
    return arr

def add_to_group(hash,gID):
    url = f"https://api.pinata.cloud/groups/{gID}/cids"
    payload = {"cids": [hash]}
    headers = {
        "Authorization": f"Bearer {jwt_token}",
        "Content-Type": "application/json"
    }
    response = requests.request("PUT", url, json=payload, headers=headers)
    print(response.text)








