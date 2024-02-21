"use client";

//components
import Divider from "@/components/Layout/Divider";
import {ButtonGroup} from "@/components/Buttons";
import ObjectBg from "@/components/Layout/ObjectBg";

//utils
import Util from "@/Util";
import Api from "@/server-actions/Api";

//context
import { useAccountContext } from "@/context/AccountContext";

//assets
import { IoMdInformationCircleOutline } from "react-icons/io";

//solana
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WalletConnection } from "@/hooks/WalletConnection";

//style
require("@solana/wallet-adapter-react-ui/styles.css");

//React/Next
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import { Tooltip } from "@geist-ui/core";


import { toast } from "sonner";
import Textbox from "@/components/Textbox";

export default function FulfillRequestPage() {
    const urlParams = useParams<{
        to_username: string;
        amount: string;
        currency: string;
        description: string;
    }>();

    const {account} = useAccountContext();

    const to_username = urlParams.to_username;
    const amount = Util.urlToNumber(urlParams.amount);
    const currency = urlParams.currency;
    const description = Util.urlToString(urlParams.description);

    const [from_username, setFromUsername] = useState(account.username);

    const { sendSol, getSolBalance } = WalletConnection();
    const [disableTextbox, setDisableTextbox] = useState(account.username != "");

    function handleUsernameChange(e: any) {
        const { value } = e.target;
        setFromUsername(Util.stringToUrl(value));
    }

    async function sendTransactionHandler() {
        if (!account.connected) {
            toast.error("Wallet Not Connected");
            return;
        }

        console.log(amount);

        if (amount === undefined || Number.isNaN(amount)) {
            toast.error("Amount Invalid");
            return;
        }

        //
        try {
            const txn_hash: string | undefined = await sendSol(
                to_username,
                amount
            );
            if (txn_hash) {
                Util.transactionToast(txn_hash);
                Api.saveTransaction(
                    Api.TransactionType.Request,
                    await Api.getPubkey(to_username),
                    "So11111111111111111111111111111111111111112",
                    amount,
                    description,
                    account.pubkey,
                    txn_hash
                );
                if (from_username !== "" && account.connected) {
                    Api.saveUser(
                        from_username,
                        account.pubkey,
                        true,
                        true
                    );
                }
            }
        } catch (e: any) {
            toast.error(e.message);
        }
    }

    // Route -> /shop/[tag]/[item]
    // URL -> /shop/shoes/nike-air-max-97
    // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }

    return (
        <div>
            <Head>
                <title>Contact - TitleMetaNextjs</title>
                <meta
                    name="description"
                    content="Meta description for the Contact page"
                />
            </Head>

            <div className={"py-6 sm:py-8 lg:py-12"}>
                <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                    <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-gray-300 md:mb-8 lg:text-3xl">
                        Completing {to_username}&apos;s Payment Request
                    </h2>

                    <ObjectBg>
                        <div className="flex justify-center">
                            <WalletMultiButton />
                        </div>

                        <Textbox
                            label={
                                <div className="flex space-x-1 items-center">
                                    <p>Username</p>
                                    <Tooltip
                                        text={
                                            "Add a username to create your own account"
                                        }
                                        placement="right"
                                    >
                                        <IoMdInformationCircleOutline className="h-5 w-5" />
                                    </Tooltip>
                                </div>
                            }
                            input_name="username"
                            value={from_username}
                            handler={handleUsernameChange}
                            max_length={8}
                            disabled={disableTextbox}
                        />

                        <div>
                            <p>
                                Amount: {amount}
                                {currency}
                            </p>
                            <p>Description: {description}</p>
                        </div>

                        <div className="flex justify-center">
                            <button
                                className={` block w-1/2 rounded-lg bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 px-8 py-3 text-center text-sm font-semibold text-white
                                        outline-none ring-gray-300 
                                        transition duration-100 hover:from-indigo-400 hover:via-sky-400
                                        hover:to-emerald-400 focus-visible:ring md:text-base                  
                                        `}
                                onClick={() => sendTransactionHandler()}
                            >
                                Send&nbsp;🚀
                            </button>
                        </div>
                    </ObjectBg>
                </div>
            </div>
        </div>
    );
}
