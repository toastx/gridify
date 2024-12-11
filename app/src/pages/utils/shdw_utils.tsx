import { ShdwDrive, ShadowFile } from '@shadow-drive/sdk';
import { PublicKey } from '@solana/web3.js';


export async function shdw_drive(connection:any,wallet:any) { 
    const drive = await new ShdwDrive(connection, wallet).init();
    return drive
}

export async function createAccount(drive: ShdwDrive) { 
    const newAcct = await drive.createStorageAccount("gridify", "10MB");
}
export async function retrieveAccount(drive: ShdwDrive) { 
    const accts = await drive.getStorageAccounts();
    return new PublicKey(accts[0].publicKey)
}
export async function uploadFile(name: String, address: String,location:String, drive: ShdwDrive) {
    const data = {
        "grid":address
    }
    const jsonString = JSON.stringify(data)
    const blob = new Blob([jsonString], { type: "application/json" })
    const file = new File([blob], `${name}-${location}`, { type: "application/json" })
    
    const storageAccount = await retrieveAccount(drive);

    const res = await drive.uploadFile(storageAccount, file)
    console.log(res)
    
}

export async function retreiveFile(drive: ShdwDrive) { 
    const storageAccount = await retrieveAccount(drive);
    let items = await drive.listObjects(storageAccount)
    console.log(items)
}

