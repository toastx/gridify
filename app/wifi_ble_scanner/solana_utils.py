from solathon import Client, Keypair, Transaction, PublicKey, Instruction
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("API_KEY")
secret_key = os.getenv("SECRET_KEY")
program_id = os.getenv("PROGRAM_ID")

program = PublicKey(program_id)


devnet_url = f"https://devnet.helius-rpc.com/?api-key={api_key}"

client = Client(devnet_url,True)
wallet = Keypair.from_private_key(secret_key)


def register_device(device_id: str):
    tx = Transaction(
        fee_payer=wallet.public_key,
        signers=[wallet],
        instructions=[
            Instruction(program, "register", [device_id])
        ]
)





