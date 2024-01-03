import { PublicKey } from "@solana/web3.js";
import { toast } from "sonner";
import { FaExternalLinkAlt } from "react-icons/fa";


const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);
const random = (number: number) => Math.floor(Math.random() * number);
const cleanStringForURL = (input: string) => {
    //figure out regex for a period later, its not that deep
    return input
        .replace(/[^A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]/g, "-")
        .replace(".", "");
};

const stringNumericOnly = (val: string): string => {
    //figure out regex for a period later, its not that deep

    val = val.replace(/[^0-9\.]/g, "");
    if (val.split(".").length > 2) {
        val = val.replace(/\.+$/, "");
    }
    return val;
};

const getEmojiHref = (input:string): string => `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${input}</text></svg>`

const validateSolanaAddress = (addr: string) => {
    let publicKey: PublicKey;
    try {
        publicKey = new PublicKey(addr);
        return PublicKey.isOnCurve(publicKey.toBytes());
    } catch (err) {
        return false;
    }
};

const capitalize = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);
const truncate = (longString: string, limit: number = 13) => {
    if (longString.length > limit) {
        return longString.substring(0, limit) + "...";
    }

    return longString;
};

enum SolscanType{
    tx="tx",
    account="account"
}

const solscanUrl = (type:SolscanType, id:string): string => {
    return `https://solscan.io/${type}/${id}`
}

const transactionToast = (txn_hash:string) => {
    toast.success(
        <div className="flex flex-col">
            Transaction Successful
            <a
                href={solscanUrl(SolscanType.tx, txn_hash)}
                className="flex flex-row text-decoration-line: underline"
            >
                {truncate(txn_hash, 20)}
                <FaExternalLinkAlt />
            </a>
        </div>
    );
}

export default {
    copyToClipboard,
    random,
    cleanStringForURL,
    stringNumericOnly,
    validateSolanaAddress,
    capitalize,
    truncate,
    SolscanType,
    solscanUrl,
    transactionToast,
    getEmojiHref
};
