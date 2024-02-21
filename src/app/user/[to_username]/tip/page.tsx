"use client";

//components
import Divider from "../../../../components/Layout/Divider";
import { ButtonGroup } from "@/components/Buttons";
import SingleActionModal from "../../../../components/Modals/SingleActionModal";
import ObjectBg from "@/components/Layout/ObjectBg";

//utils
import Util from "../../../../Util";
import Api from "@/server-actions/Api";

//context
import { useAccountContext } from "@/context/AccountContext";

//assets
import { IoMdInformationCircleOutline } from "react-icons/io";

//solana
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WalletConnection } from "../../../../hooks/WalletConnection";

//React/Next
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import { Tooltip } from "@geist-ui/core";


import { toast } from "sonner";
import Textbox from "@/components/Textbox";
import Leaderboard from "@/components/Leaderboard";

const tip_amounts = [0.1, 0.5, 1]; //sol];
const tip_strings = ["0.1 ◎", "0.5 ◎", "1 ◎"];
const leaderboard_size = 3;

export default function TipScreen() {
    const [amountIdx, setAmountIdx] = useState(1);
    const urlParams = useParams<{ to_username: string }>();
    const [from_username, setFromUsername] = useState("");
    const to_username = urlParams.to_username;
    const { sendSol, getSolBalance } = WalletConnection();
    const [disableTextbox, setDisableTextbox] = useState(false);
    const {account} = useAccountContext();

    const [customAmount, setCustomAmount] = useState(
        tip_amounts[amountIdx].toString()
    );

    const [topSingleTransactions, setTopSingleTransactions] =
        useState<any[][]>();
    const [topTotalTransactions, setTopTotalTransactions] = useState<any[][]>();

    const updateLeaderboards = async () => {
        Api.getTopSingleTransactions(
            to_username,
            Api.TransactionType.Tip,
            leaderboard_size
        ).then((result) => {
            setTopSingleTransactions(result);
        });

        Api.getTopTotalTransactions(
            to_username,
            Api.TransactionType.Tip,
            leaderboard_size
        ).then((result) => {
            setTopTotalTransactions(result);
        });
    };

    useEffect(() => {
        updateLeaderboards();
        if (account.connected) {
            Api.getUsername(account.pubkey).then((result) => {
                setFromUsername(result);
                if (result != "") {
                    setDisableTextbox(true);
                }
            });
        } else {
            setFromUsername("");
            setDisableTextbox(false);
        }
    }, [account.connected]);

    function handleUsernameChange(e: any) {
        const { value } = e.target;
        setFromUsername(Util.stringToUrl(value));
    }

    function handleCustomAmount(e: any) {
        const { value } = e.target;
        setCustomAmount(Util.stringNumericOnly(value));
    }

    async function handleMaxButtonClick() {
        const wallet_balance: number = await Util.getWalletBalance();
        if (wallet_balance > 0.1) {
            const max_amount = (wallet_balance - 0.1).toFixed(2);
            setCustomAmount(max_amount.toString());
        } else {
            setCustomAmount(tip_amounts[amountIdx].toString());
        }
    }

    async function sendTransactionHandler() {
        if (!account.connected) {
            toast.error("Wallet Not Connected");
            return;
        }
        let tip_amount = tip_amounts[amountIdx];
        if (customAmount !== "") {
            tip_amount = parseFloat(customAmount);
        }

        //
        try {
            const txn_hash: string | undefined = await sendSol(
                to_username,
                tip_amount
            );
            if (txn_hash) {
                Util.transactionToast(txn_hash);
                Api.saveTransaction(
                    Api.TransactionType.Tip,
                    await Api.getPubkey(to_username),
                    "So11111111111111111111111111111111111111112",
                    tip_amount,
                    `wallet: ${account.pubkey} tips user: ${to_username}`,
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
                updateLeaderboards();
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
                        Tipping {to_username}
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
                                            "Add a username to make your own tip link"
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

                        <Divider text={"Choose tip amount"} />

                        {/* Amount Choices */}
                        <ButtonGroup
                            options={tip_strings}
                            orientation={"row"}
                            select_color={"blue"}
                            select_criteria={amountIdx}
                            handler={(value: any) => {
                                setAmountIdx(value);
                                setCustomAmount(tip_amounts[value].toString());
                            }}
                        />

                        <div className="flex flex-row justify-center align-middle place-items-end">
                            <Textbox
                                label={`Custom Amount:`}
                                input_name="custom_amount"
                                value={customAmount}
                                handler={handleCustomAmount}
                                max_length={8}
                                button={
                                    <button
                                        className="float-right text-decoration-line: underline"
                                        type="button"
                                        onClick={() => handleMaxButtonClick()}
                                    >
                                        Max
                                    </button>
                                }
                            />
                            <p className="py-4 px-1">◎</p>
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

                    <h2 className="text-center text-lg mt-14">
                        {to_username}&apos;s Largest Tippers (USD)
                    </h2>
                    <div className="flex flex-row grid-cols-3 mx-auto w-full max-w-2xl text-center">
                        <Leaderboard
                            title="Single Transaction"
                            items={topSingleTransactions}
                        />
                        <div className="w-1/6"></div>
                        <Leaderboard
                            title="Aggregate"
                            items={topTotalTransactions}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
