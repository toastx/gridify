import { Signer,Connection, PublicKey, Transaction, Keypair, sendAndConfirmTransaction,} from '@solana/web3.js';
import idl from "./idl.json"
import { Program,Idl } from '@coral-xyz/anchor';
const SYSTEM_PROGRAM_ADDRESS = new PublicKey("11111111111111111111111111111111")  ;



const parsedIdl = JSON.parse(JSON.stringify(idl)) as Idl;
const connection = new Connection("https://api.devnet.solana.com");
const programId = new PublicKey(idl.metadata.address);
const program = new Program(parsedIdl, programId, {connection});



export async function createGrid(wallet: any) {
  let manager = new PublicKey(wallet.publicKey());
  console.log(manager.toString());
  let gridAccount = Keypair.generate()
  console.log(wallet.publicKey());
  try {
    const tx = await program.methods
      .newGrid()
      .accounts({
        gridAccount: gridAccount.publicKey,
        manager: manager,
        systemProgram: SYSTEM_PROGRAM_ADDRESS,
      })
      .signers([gridAccount])
      .transaction();
    
    tx.feePayer = manager;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
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

export async function sendTransaction(tx: Transaction) { 
  console.log(tx);
  const signature = await connection.sendRawTransaction(tx.serialize());
  let stx = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
  return stx;
}




