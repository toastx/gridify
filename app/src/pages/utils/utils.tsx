import { Connection, PublicKey, Transaction, Keypair, sendAndConfirmTransaction} from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN , Wallet} from '@project-serum/anchor';
import idl from "./idl.json"
import { AnchorWallet } from '@solana/wallet-adapter-react';


const connection = new Connection(process.env.RPC_URL || "");
const wallet_keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.SECRET_KEY || "")));


const programId = new PublicKey(idl.metadata.address);
const program = JSON.parse(JSON.stringify(idl));



export async function createGrid(wallet:AnchorWallet) {
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "processed" as web3.Commitment,
  });
  try {
    const tx = await program.methods
      .newGrid()
      .accounts({
        gridAccount: Keypair.generate().publicKey,
        manager: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
    
    console.log("Grid created! Transaction:", tx);
    let txn = tx.signTransaction(tx);
    let txn_confirmed = await provider.sendAndConfirm(txn);
    return txn_confirmed

  } catch (error) {
    console.error("Error creating grid:", error);
    throw error;
  }
}

export async function registerDevice(deviceId: string, wallet:AnchorWallet) {
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "processed" as web3.Commitment,
  });
  try {
    const tx = await program.methods
      .register(deviceId)
      .accounts({
        deviceAccount: Keypair.generate().publicKey,
        owner: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
    
    console.log("Device registered! Transaction:", tx);
    return tx;
  } catch (error) {
    console.error("Error registering device:", error);
    throw error;
  }
}

export async function getGrids(wallet:AnchorWallet) {
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "processed" as web3.Commitment,
  });
  try {
    const grids = await program.account.gridAccount.all();
    return grids.map(grid => ({
      publicKey: grid.publicKey.toString(),
      ...grid.account
    }));
  } catch (error) {
    console.error("Error fetching grids:", error);
    throw error;
  }
}

export async function getDevices(wallet:AnchorWallet) {
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "processed" as web3.Commitment,
  });
  try {
    const devices = await program.account.deviceAccount.all();
    return devices.map((device: { publicKey: { toString: () => any; }; account: any; }) => ({
      publicKey: device.publicKey.toString(),
      ...device.account
    }));
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw error;
  }
}


