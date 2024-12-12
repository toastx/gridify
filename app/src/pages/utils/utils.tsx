import { Signer,Connection, PublicKey, Transaction, Keypair, sendAndConfirmTransaction,} from '@solana/web3.js';
import idl from "./idl.json"
import { Program,Idl } from '@coral-xyz/anchor';
import { ShdwDrive } from '@shadow-drive/sdk';
const SYSTEM_PROGRAM_ADDRESS = new PublicKey("11111111111111111111111111111111")  ;


const parsedIdl = JSON.parse(JSON.stringify(idl)) as Idl;
const connection = new Connection("https://api.devnet.solana.com");
const programId = new PublicKey(idl.metadata.address);
const program = new Program(parsedIdl, programId, { connection });


export async function createGrid(wallet: any) {
  let manager = new PublicKey(wallet.publicKey());
  let gridAccount = Keypair.generate()
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
    tx.partialSign(gridAccount)
    return {
      transaction: tx,
      gridAccountPublicKey: gridAccount.publicKey,
    }

  } catch (error) {
    console.error("Error creating grid:", error);
    throw error;
  }
}

export async function registerDevice(grid: PublicKey, wallet: any) {
  let owner = new PublicKey(wallet.publicKey());
  let deviceAccount = Keypair.generate()
  try {
    const tx = await program.methods
      .register(grid)
      .accounts({
        gridAccount: deviceAccount.publicKey,
        owner: owner,
        systemProgram: SYSTEM_PROGRAM_ADDRESS,
      })
      .signers([deviceAccount])
      .transaction()
    
      tx.feePayer = owner;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.partialSign(deviceAccount)
    
      return {
        transaction: tx,
        deviceAccountPublicKey: deviceAccount.publicKey,
      }
    
  } catch (error) {
    console.error("Error registering device:", error);
    throw error;
  }
}

export async function sendTransaction(tx: Transaction) { 
  const signature = await connection.sendRawTransaction(tx.serialize());
  let stx = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
  return stx;
}

export async function fetchGrids(wallet:any) { 
  try {
    const accounts = await connection.getProgramAccounts(programId)
    return accounts
  }
  catch (error) { 
    console.log(error)
    throw error
  }
}




