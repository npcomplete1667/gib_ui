import { toast } from "sonner";
import translateError from "@/Util/errorTranslation";
import Util from "@/Util";

enum TransactionType {
    Tip = "Tip",
    Transfer = "Transfer",
    Request = "Request",
}

enum PlatformType {
    twitter = "twitter",
    discord = "discord",
}

class account {
    username: string = "";
    pay_dev:boolean = false;
    pfp_provider: string = "";
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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/save-user`;

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
    txn_type: TransactionType,
    to_wallet: string,
    token_account: string,
    amount: number,
    description: string,
    from_wallet?: string,
    txn_hash?: string
): Promise<boolean> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/save-transaction`;

    const response: Response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            txn_type: txn_type,
            to_wallet: to_wallet,
            token_account: token_account,
            amount: amount,
            description: description,
            from_wallet: from_wallet,
            txn_hash: txn_hash,
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

async function saveSingleImage(
    username: string,
    pubkey: string,
    verified: boolean,
    pay_dev: boolean
): Promise<boolean> {
    console.log("API saveUser called");
    const url = `${process.env.NEXT_PUBLIC_API_URL}/save-user`;

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

async function saveSocialAccount(
    id: string,
    accountId: string,
    platform: string | null | undefined | PlatformType,
    username: string | null | undefined,
    handle: string | null | undefined,
    email: string | null | undefined,
    image_url: string | null | undefined
): Promise<boolean> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/save-social-account`;
    console.log("URL:", url);
    console.log("accountId", accountId);

    const response: Response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: id,
            account_id: accountId,
            platform: platform,
            username: username,
            handle: handle,
            email: email,
            image_url: image_url,
        }),
    });

    if (response.ok) {
        console.log("Transaction saved successfully");
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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/create-sol-transfer-transaction`;

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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/get-top-single-transactions/${to_username}/${txn_type}/${limit}`;

    const response: any = await fetch(url, { method: "GET" });

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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/get-top-total-transactions/${to_username}/${txn_type}/${limit}`;

    const response: any = await fetch(url, { method: "GET" });

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

async function getPubkey(account_id: string): Promise<string> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/get-pubkey/${account_id}`;
    const response: any = await fetch(url, { method: "GET" });
    const data = await response.json();

    if (response.ok) {
        return data.message;
    } else {
        console.log(data.message);
        toast.error(data.message);
    }
    return "";
}

async function getUsername(account_id: string): Promise<string> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/get-username/${account_id}`;
    console.log(url);
    const response: any = await fetch(url, { method: "GET" });
    const data = await response.json();

    if (response.ok) {
        return data.message;
    } else {
        console.log(data.message);
        toast.error(data.message);
    }
    return "";
}

function getAccountId(pubkey: string): Promise<string> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/get-account-id/${pubkey}`;
    return fetch(url, { method: "GET" })
    .then(response => response.json())
    .then(data => data.message)
    .catch(error => toast.error(error))
}

async function getSocialAccount(
    account_id: string,
    platform: string
): Promise<string[]> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/get-social-account/${account_id}/${platform}`;
    console.log(url);
    const response: any = await fetch(url, { method: "GET" });
    const data = await response.json();

    if (response.ok) {
        return [
            data.message["id"],
            data.message["username"],
            data.message["handle"],
            data.message["image_url"],
        ];
    } else {
        console.log(data.message);
        toast.error(data.message);
    }
    //nit: return something more meaningful than this
    return ["", ""];
}

async function getAccount(account_id: string): Promise<account> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/get-account/${account_id}`;
    console.log("getAccount:", url);
    const response: any = await fetch(url, { method: "GET" });
    const data = await response.json();

    if (response.ok) {
        return data.message;
    } else {
        console.log(data.message);
        toast.error(data.message);
    }
    //nit: return something more meaningful than this

    return {
        username: "",
        pay_dev:false,
        pfp_provider: "",
    };
}


function updateAccount(
    account_id: string,
    username: string,
    pay_dev:boolean,
    pfp_provider:string
) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/update-account/${account_id}/${username}/${pay_dev}/${pfp_provider}`;
    console.log(url);
    fetch(url, { method: "PUT" })
    .catch(error => toast.error(error))
}

function updateUsername(
    account_id: string,
    new_username: string
) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/update-username/${account_id}/${new_username}`;
    console.log(url);
    fetch(url, { method: "PUT" })
    .catch(error => toast.error(error))
}

function updatePfpProvider(
    account_id: string,
    new_username: string
) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/update-pfp-provider/${account_id}/${new_username}`;
    console.log(url);
    fetch(url, { method: "PUT" })
    .catch(error => toast.error(error))
}

async function getUsernameLike(search_query: string) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/search-username/${search_query}`;
    const response: any = await fetch(url, { method: "GET" });
    const data = await response.json();

    if (response.ok) {
        return data.message;
    } else {
        console.log(data.message);
        toast.error(data.message);
    }
}

export default {
    getAccountId,
    createSolTransferTransaction,
    getPubkey,

    getUsername,
    updateUsername,
    updateAccount,
    getUsernameLike,
    updatePfpProvider,

    saveUser,

    saveSocialAccount,
    getSocialAccount,
    getAccount,

    saveTransaction,
    saveSingleImage,
    getTopSingleTransactions,
    getTopTotalTransactions,
    TransactionType,
    PlatformType,
};
