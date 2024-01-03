"use client";

//components
import Divider from "../../../components/Layout/Divider";
import ButtonGroup from "../../../components/Buttons/ButtonGroup";
import SingleActionModal from "../../../components/Modals/SingleActionModal";
import ObjectBg from "@/components/Layout/ObjectBg";

//utils
import Util from "../../../Util";
import Api from "@/server-actions/Api";

//assets
import clipboardImage from "/public/images/copy.png";

//solana
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WalletConnection } from "../../../hooks/WalletConnection";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

//React/Next
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head"

require("@solana/wallet-adapter-react-ui/styles.css");
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
    const { connected, publicKey } = useWallet();
    const { sendSol, getSolBalance } = WalletConnection();

    const [customAmount, setCustomAmount] = useState(
        tip_amounts[amountIdx].toString()
    );

    const [topSingleTransactions, setTopSingleTransactions] =
        useState<any[][]>();
    const [topTotalTransactions, setTopTotalTransactions] = useState<any[][]>();

    const getTopSingleTransactions = async () => {
        const result: any[][] = await Api.getTopSingleTransactions(
            to_username,
            Api.TransactionType.Tip,
            leaderboard_size
        );
        setTopSingleTransactions(result);
    };

    const getTopTotalTransactions = async () => {
        const result: any[][] = await Api.getTopTotalTransactions(
            to_username,
            Api.TransactionType.Tip,
            leaderboard_size
        );
        setTopTotalTransactions(result);
    };

    useEffect(() => {
        getTopSingleTransactions();
        getTopTotalTransactions();
    }, []);

    function handleTipAmountChange(value: number) {
        setAmountIdx(value);
        setCustomAmount(tip_amounts[value].toString());
    }

    function handleUsernameChange(e: any) {
        const { value } = e.target;
        setFromUsername(Util.cleanStringForURL(value));
    }

    function handleCustomAmount(e: any) {
        const { value } = e.target;
        setCustomAmount(Util.stringNumericOnly(value));
    }

    async function handleMaxButtonClick() {
        const wallet_balance: number = await getSolBalance();
        let max_amount = (wallet_balance - 0.1).toFixed(2);
        if (wallet_balance > 0.1) {
            setCustomAmount(max_amount.toString());
        } else {
            setCustomAmount("0");
        }
    }

    async function sendTransactionHandler() {
        if (!connected) {
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
                    txn_hash,
                    Api.TransactionType.Tip,
                    publicKey!.toString(),
                    to_username,
                    `wallet: ${publicKey!.toString()} tips user: ${to_username}`,
                    "So11111111111111111111111111111111111111112",
                    tip_amount
                );
                if (from_username !== "" && publicKey) {
                    Api.saveUser(
                        from_username,
                        publicKey.toString(),
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
  <title>Your page title</title>
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
                            label_text="Username (*Optional)"
                            input_name="username"
                            value={from_username}
                            handler={handleUsernameChange}
                            max_length={8}
                        />

                        <Divider text={"Choose tip amount"} />

                        {/* Amount Choices */}
                        <ButtonGroup
                            options={tip_strings}
                            orientation={"row"}
                            select_color={"blue"}
                            select_criteria={amountIdx}
                            handler={handleTipAmountChange}
                        />

                        <div className="flex flex-row justify-center align-middle place-items-end">
                            <Textbox
                                label_text={`Custom Amount:`}
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

                    <h2 className="text-center mt-14">
                        {to_username}'s Largest Tippers (USD)
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