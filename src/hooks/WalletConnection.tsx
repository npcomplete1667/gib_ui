import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import API from "../server-actions/Api";
import { toast } from "sonner";

export const WalletConnection = () => {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();

    // //Run the transaction
    const sendSol = async (
        toUsername: string,
        amount: number
    ): Promise<string | undefined> => {
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

    const getSolBalance = async (): Promise<number> => {
        if (publicKey) {
            let balance = await connection.getBalance(publicKey);
            return balance / LAMPORTS_PER_SOL;
        }
        toast.error("Wallet not Connected");
        return 0
    };

    return {
        sendSol,
        getSolBalance,
    };
};
