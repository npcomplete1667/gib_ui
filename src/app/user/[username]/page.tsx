"use client";

//components
import Divider from "../../../components/Divider";
import ButtonGroup from "../../../components/Buttons/ButtonGroup";
import SingleActionModal from "../../../components/Modals/SingleActionModal";

//utils
import Util from "../../../utils";

//assets
import clipboardImage from "/public/images/copy.png";
import { FaExternalLinkAlt } from "react-icons/fa";

//solana
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WalletConnection } from "../../../hooks/WalletConnection";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

//React/Next
import React, { useState } from "react";
import { useParams } from "next/navigation";

require("@solana/wallet-adapter-react-ui/styles.css");
import { toast } from "sonner";

const tip_amounts = [0.1, 0.5, 1]; //sol];
const tip_strings = ["0.1 ◎", "0.5 ◎", "1 ◎"];

export default function TipScreen() {
    const [amount, setAmount] = useState(1);
    const urlParams = useParams<{ username: string }>();
    const username = urlParams.username;
    const { connected, publicKey } = useWallet();
    const { sendSol } = WalletConnection();

    async function sendTransactionHandler() {
        //check if connected wallet
        if (!connected) {
            toast.error("Wallet Not Connected");
            return;
        }

        const txnHash: string | undefined = await sendSol(
            username,
            tip_amounts[amount]
        );
        if (txnHash) {
            toast.success(
                <div className="flex flex-col">
                    Transaction Successful
                    <a
                        href={`https://solscan.io/tx/${txnHash}`}
                        className="flex flex-row text-decoration-line: underline"
                    >
                        {Util.truncate(txnHash, 20)}
                        <FaExternalLinkAlt />
                    </a>
                </div>
            );
        }

        //check if username exists

        //need to check if already exists in db
        //need to save info to db
    }

    // Route -> /shop/[tag]/[item]
    // URL -> /shop/shoes/nike-air-max-97
    // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }

    return (
        <div>
            <div className={"py-6 sm:py-8 lg:py-12"}>
                <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                    <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-gray-300 md:mb-8 lg:text-3xl">
                        Tipping {username}
                    </h2>

                    <div className="bg-objectBg mx-auto max-w-lg rounded-lg border dark:border-gray-700">
                        <div className="flex flex-col gap-4 p-4 md:p-8">
                            <div className="flex justify-center">
                                <WalletMultiButton />
                            </div>

                            <Divider text={"Choose tip amount"} />

                            {/* Amount Choices */}
                            <ButtonGroup
                                options={tip_strings}
                                orientation={"row"}
                                select_color={"blue"}
                                select_criteria={amount}
                                handler={setAmount}
                            />

                            {/* <ButtonGroup
                                options={["YES!!🤠", no_prompt[state.payDev]]}
                                orientation={"col"}
                                select_color={"blue"}
                                select_criteria={state.payDev}
                                handler={payDevChange}
                            /> */}

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
                        </div>

                        <div className="flex items-center justify-center bg-gray-200 dark:dark:bg-white/5 p-4">
                            <p className="text-center text-sm text-gray-500">
                                {/* Link Preview: {getCleanedURL()} */}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
