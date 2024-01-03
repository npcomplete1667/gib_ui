"use client";

//components
import Divider from "../../components/Layout/Divider";
import ButtonGroup from "../../components/Buttons/ButtonGroup";
import SingleActionModal from "../../components/Modals/SingleActionModal";
import Textbox from "@/components/Textbox";
import ObjectBg from "@/components/Layout/ObjectBg";
import { toast } from "sonner";

//utils
import Util from "../../Util";
import Api from "@/server-actions/Api";

//assets
import { LuClipboardCopy } from "react-icons/lu";

//solana
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

//React/Next
import React, { useEffect, useState } from "react";
import Head from "next/head";

require("@solana/wallet-adapter-react-ui/styles.css");
import { TwitterShareButton, XIcon } from "react-share";

const default_choices = {
    wallet_address: "",
    username: `degen${Util.random(1000)}`,
    payDev: 0,
};

const no_prompt = [
    "Hell No Fuck that guy😩",
    "fucking minors i see📸🤨, save it for the judge pal",
];

function TipSetup() {
    const { publicKey } = useWallet();
    const [state, setState] = useState(default_choices);
    const [shareLinkModalOpen, setShareLinkModalOpen] = useState(false);

    const currencyDefaults = [0.5, 1, 3]; //sol];

    async function generateLinkClickedHandler() {
        if (!Util.validateSolanaAddress(state.wallet_address)) {
            toast.error("Invalid Wallet Address Provided");
            return;
        }

        if (
            await Api.saveUser(
                state.username,
                state.wallet_address,
                publicKey !== null,
                state.payDev == 0
            )
        ) {
            setShareLinkModalOpen(true);
        }
        //need to save info to db
    }

    function handleChange(e: any) {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: value,
        });
    }

    function getCleanedURL() {
        return Util.cleanStringForURL(
            `${process.env.NEXT_PUBLIC_URL}/user/${state.username}`
        );
    }

    function handleUsernameChange(e: any) {
        const { name, value } = e.target;
        setState({
            ...state,
            username: Util.cleanStringForURL(value),
        });
    }

    function payDevChange(choice: number) {
        setState({
            ...state,
            payDev: choice,
        });
        console.log(state);
    }

    useEffect(() => {
        let wallet_address = ``;
        if (publicKey) {
            wallet_address = publicKey.toString();
        }
        setState({
            ...state,
            wallet_address: wallet_address,
        });
    }, [publicKey]);

    return (
        <div>
            <Head>
                <title>Tip Setup</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>

            <SingleActionModal
                modalOpen={shareLinkModalOpen}
                setModalOpen={setShareLinkModalOpen}
                title={"Link Created"}
                body={
                    <>
                        <a
                            href={`https://${getCleanedURL()}`}
                            className="text-sm text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
                        >
                            {getCleanedURL()}
                        </a>
                        <button
                            title="copyToClipboardButton"
                            type="button"
                            onClick={() => {
                                Util.copyToClipboard(
                                    `https://${getCleanedURL()}`
                                );
                            }}
                        >
                            <LuClipboardCopy />
                        </button>
                    </>
                }
                button_color={"gray"}
                button_body={
                    <TwitterShareButton
                        title={"gib me ur sol\n"}
                        url={getCleanedURL()}
                        className="flex w-full flex-row items-center justify-center"
                    >
                        Share on &nbsp;
                        <XIcon size={32} />
                    </TwitterShareButton>
                }
                handler={"fill in later"}
            />

            <div className={"bg-siteBg py-6 sm:py-8 lg:py-12"}>
                <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                    <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-gray-300 md:mb-8 lg:text-3xl">
                        Setup Your own Tip Link
                    </h2>
                    <ObjectBg footer={`Link Preview: ${getCleanedURL()}`}>
                        <div className="flex justify-center">
                            <WalletMultiButton />
                        </div>

                        <Divider text={"or"} />

                        <Textbox
                            label_text={`Copy/Paste your wallet address`}
                            input_name="wallet_address"
                            value={state.wallet_address}
                            handler={handleChange}
                            max_length={44}
                            validator={
                                !Util.validateSolanaAddress(
                                    state.wallet_address
                                ) && state.wallet_address != ""
                            }
                            error_text="Invalid Wallet Address"
                        />

                        <Textbox
                            label_text="Username"
                            input_name="username"
                            value={state.username}
                            handler={handleUsernameChange}
                            max_length={8}
                        />

                        <Divider text={"gib 0.5% to dev?😃"} />

                        <ButtonGroup
                            options={["YES!!🤠", no_prompt[state.payDev]]}
                            orientation={"col"}
                            select_color={"blue"}
                            select_criteria={state.payDev}
                            handler={payDevChange}
                        />

                        <div className="flex justify-center">
                            <button
                                className={` block w-1/2 rounded-lg bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 px-8 py-3 text-center text-sm font-semibold text-white
                                        outline-none ring-gray-300 
                                        transition duration-100 hover:from-indigo-400 hover:via-sky-400
                                        hover:to-emerald-400 focus-visible:ring md:text-base                  
                                        `}
                                onClick={() => generateLinkClickedHandler()}
                            >
                                Generate Link🚀
                            </button>
                        </div>
                    </ObjectBg>
                </div>
            </div>
        </div>
    );
}

export default TipSetup;
