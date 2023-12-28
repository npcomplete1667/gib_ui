import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import API from "../server-actions/Api";
import { toast } from "sonner";

export const WalletConnection = () => {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();

    // //Run the transaction
    const sendSol = async (toUsername: string, amount: number) => {
        if (!publicKey) {
            toast.error("Wallet Not Connected");
            return "";
        }
        const fromWallet = publicKey.toString();
        const base64Transaction = await API.createSolTransferTransaction(
            fromWallet,
            toUsername,
            amount
        );
        if (base64Transaction) {
            const transaction = Transaction.from(
                Buffer.from(base64Transaction, "base64")
            );

            return sendTransaction(transaction, connection);
        }
    };

    return {
        sendSol,
    };
};
