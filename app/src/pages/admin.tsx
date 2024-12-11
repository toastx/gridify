import { createAccount, uploadFile, shdw_drive, retreiveFile } from "./utils/shdw_utils";
import { Connection } from "@solana/web3.js";
import { useWallet } from "./WalletConnect";
import { createEffect, createSignal } from "solid-js";
import { ShdwDrive } from "@shadow-drive/sdk";

function Admin() {
    const [drive, setDrive] = createSignal<ShdwDrive | null>(null); // Initialize as null
    const connection = new Connection("https://api.devnet.solana.com");
    const wallet = useWallet();

    // Effect to initialize ShdwDrive
    createEffect(async () => {
        if (wallet && wallet.publicKey()) {
            try {
                const driveClient = await shdw_drive(connection, wallet); // Initialize the drive
                setDrive(driveClient); // Update the drive signal
            } catch (error) {
                console.error("Failed to initialize Shadow Drive:", error);
            }
        } else {
            console.warn("Wallet not connected");
        }
    });

    // Render UI
    return (
        <div>
            {drive() ? (
                <div>
                    <button
                        onClick={async () => {
                            const activeDrive = drive();
                            if (activeDrive) {
                                await createAccount(activeDrive);
                            }
                        }}
                    >
                        Create
                    </button>
                    <button
                        onClick={async () => {
                            const activeDrive = drive();
                            if (activeDrive) {
                                await uploadFile("yes", "1234", "indie", activeDrive);
                            }
                        }}
                    >
                        Upload
                    </button>
                    <button
                        onClick={async () => {
                            const activeDrive = drive();
                            if (activeDrive) {
                                await retreiveFile(activeDrive);
                            }
                        }}
                    >
                        Fetch
                    </button>
                </div>
            ) : (
                <p>Loading Shadow Drive...</p>
            )}
        </div>
    );
}

export default Admin;
