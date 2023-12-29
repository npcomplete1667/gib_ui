import { PublicKey } from "@solana/web3.js";

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
const truncate = (longString: string, limit: number = 10) => {
    if (longString.length > limit) {
        return longString.substring(0, limit) + "...";
    }

    return longString;
};

export default {
    copyToClipboard,
    random,
    cleanStringForURL,
    stringNumericOnly,
    validateSolanaAddress,
    capitalize,
    truncate,
};
