import { toast } from "sonner";
import translateError from "@/utils/errorTranslation";

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
    let url = process.env.NEXT_PUBLIC_API_URL + "/save-user";
    console.log(url);

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
    })

    if (response.ok) {
        toast.success("Link created successfully");
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
    console.log(url);

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
    })

    const data = await response.json();
    console.log("THIS IS THE SPOIT", response.ok)

    if(response.ok){
        return data.message;
    } else {
        console.log(data.message);
        toast.error(data.message);
    }
}



export default {
    createSolTransferTransaction,
    saveUser,
};