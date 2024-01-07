import { toast } from "sonner";
import translateError from "@/Util/errorTranslation";
import Util from "@/Util";

enum TransactionType {
    Tip = "Tip",
    Transfer = "Transfer",
    Request = "Request",
}

async function get(tail: string) {
    let url = process.env.NEXT_PUBLIC_API_URL + tail;

    const res = await fetch(url, {
        method: "GET",
    });

    return res.json();
}

async function saveUser(
    username: string,
    pubkey: string,
    verified: boolean,
    pay_dev: boolean
): Promise<boolean> {
    console.log("API saveUser called");
    let url = process.env.NEXT_PUBLIC_API_URL + "/save-user";

    const response: Response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            pubkey: pubkey,
            verified: verified,
            pay_dev: pay_dev,
        }),
    });

    if (response.ok) {
        toast.success("Link created successfully");
        return true;
    } else {
        const data = await response.json();
        toast.error(translateError(data.message));
        return false;
    }
}

async function saveTransaction(
    txn_hash: string,
    txn_type: TransactionType,
    from_wallet: string,
    to_username: string,
    description: string,
    token_account: string,
    amount: number
): Promise<boolean> {
    let url = process.env.NEXT_PUBLIC_API_URL + "/save-transaction";

    const response: Response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            txn_hash: txn_hash,
            txn_type: txn_type,
            from_wallet: from_wallet,
            to_username: to_username,
            description: description,
            token_account: token_account,
            amount: amount,
        }),
    });

    if (response.ok) {
        console.log("Transaction ", txn_hash, " saved successfully");
        return true;
    } else {
        const data = await response.json();
        toast.error(translateError(data.message));
        return false;
    }
}

async function createSolTransferTransaction(
    from_wallet: string,
    to_username: string,
    amount: number
) {
    let url =
        process.env.NEXT_PUBLIC_API_URL + "/create-sol-transfer-transaction";

    const response: any = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from_wallet: from_wallet,
            to_username: to_username,
            amount: amount,
        }),
    });

    const data = await response.json();

    if (response.ok) {
        return data.message;
    } else {
        console.log(data.message);
        toast.error(data.message);
    }
}

async function getTopSingleTransactions(
    to_username: string,
    txn_type: string,
    limit: number
): Promise<any[][]> {
    let url = process.env.NEXT_PUBLIC_API_URL + "/get-top-single-transactions";

    const response: any = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            to_username: to_username,
            txn_type: txn_type,
            limit: limit,
        }),
    });

    const data = await response.json();
    let res = [];

    if (response.ok) {
        for (let i = 0; i < data.message.length; i++) {
            const [txn_hash, from_account, username, usd_amount] =
                data.message[i];
            console.log(txn_hash, from_account, username, usd_amount);

            res.push([
                <a
                    key={txn_hash}
                    href={Util.solscanUrl(Util.SolscanType.tx, txn_hash)}
                    target="_blank"
                    className="text-decoration-line: underline"
                >
                    {Util.truncate(username ? username : from_account)}
                </a>,
                usd_amount,
            ]);
        }
    } else {
        console.log(data.message);
        toast.error(data.message);
    }
    console.log("getTopSingleTransactions result=", res);
    return res;
}

async function getTopTotalTransactions(
    to_username: string,
    txn_type: string,
    limit: number
) {
    let url = process.env.NEXT_PUBLIC_API_URL + "/get-top-total-transactions";

    const response: any = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            to_username: to_username,
            txn_type: txn_type,
            limit: limit,
        }),
    });

    const data = await response.json();
    let res = [];

    if (response.ok) {
        console.log("getTopTotalTransactions data.message=", data.message);

        for (let i = 0; i < data.message.length; i++) {
            const [from_account, username, total_usd_amount] = data.message[i];

            res.push([
                <a
                    key={from_account}
                    href={Util.solscanUrl(
                        Util.SolscanType.account,
                        from_account
                    )}
                    target="_blank"
                    className="text-decoration-line: underline"
                >
                    {Util.truncate(username ? username : from_account)}
                </a>,
                total_usd_amount,
            ]);
        }
    } else {
        console.log(data.message);
        toast.error(data.message);
    }
    console.log("getTopTotalTransactions result=", res);
    return res;
}

async function getUsernameFromPubkey(pubkey: string) {
    let url = process.env.NEXT_PUBLIC_API_URL + "/get-username-from-pubkey";

    const response: any = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            pubkey: pubkey,
        }),
    });

    const data = await response.json();

    if (response.ok) {
        return data.message;
    } else {
        console.log(data.message);
        toast.error(data.message);
    }
}

export default {
    createSolTransferTransaction,
    getUsernameFromPubkey,
    saveUser,
    saveTransaction,
    getTopSingleTransactions,
    getTopTotalTransactions,
    TransactionType,
};
