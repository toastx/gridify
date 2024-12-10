import { Connection, PublicKey, Transaction, Keypair, sendAndConfirmTransaction,} from '@solana/web3.js';
import idl from "./idl.json"

const SYSTEM_PROGRAM_ADDRESS = new PublicKey("11111111111111111111111111111111")  ;


const programId = new PublicKey(idl.metadata.address);
const program = JSON.parse(JSON.stringify(idl));


export async function createGrid(wallet: any) {
  
  try {
    const tx = await program.methods
      .newGrid()
      .accounts({
        gridAccount: Keypair.generate().publicKey,
        manager: wallet.publicKey,
        systemProgram: SYSTEM_PROGRAM_ADDRESS,
      })
      .rpc();
    
    console.log("Grid created! Transaction:", tx);
    return tx

  } catch (error) {
    console.error("Error creating grid:", error);
    throw error;
  }
}

export async function registerDevice(deviceId: string,wallet: any) {
  try {
    const tx = await program.methods
      .register(deviceId)
      .accounts({
        deviceAccount: Keypair.generate().publicKey,
        owner: wallet.publicKey,
        systemProgram: SYSTEM_PROGRAM_ADDRESS,
      })
      .rpc();
    
    console.log("Device registered! Transaction:", tx);
    return tx;
  } catch (error) {
    console.error("Error registering device:", error);
    throw error;
  }
}




