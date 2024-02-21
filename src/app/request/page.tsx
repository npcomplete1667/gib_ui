"use client";

//components
import Divider from "@/components/Layout/Divider";
import ObjectBg from "@/components/Layout/ObjectBg";
import UsernameSearchbox from "@/components/UsernameSearchbox";
import SingleActionModal from "../../components/Modals/SingleActionModal";
import { ButtonGroup } from "@/components/Buttons";
import {
    TwitterVerifiedBadge,
    DiscordVerifiedBadge,
} from "@/components/SocialVerification/VerifiedBadges";

//utils
import Util from "@/Util";
import Api from "@/server-actions/Api";

//context
import { useAccountContext } from "@/context/AccountContext";

//assets
import { LuClipboardCopy } from "react-icons/lu";
import { RiDeleteBack2Line } from "react-icons/ri";

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
import ProfilePicture from "@/components/ProfilePicture";

interface person {
    name: string;
    image_url: string | undefined;
    href: string | undefined;
    amount: string | undefined;
    percent: string | undefined;
    twitter_handle: string | undefined;
    discord_id: string | undefined;
}

export default function makeRequestPage() {
    const { account } = useAccountContext();
    const [from_username, setFromUsername] = useState("");

    const [disableWalletTextbox, setDisableWalletTextbox] =
        useState<boolean>(false);
    const [requestAmount, setRequestAmount] = useState<string>("0");
    const [description, setDescription] = useState<string>("");
    const [walletAddress, setWalletAddress] = useState<string>("");
    const [shareLinkModalOpen, setShareLinkModalOpen] = useState(false);
    const [selectedPeople, setSelectedPeople] = useState<person[]>([]);
    const [splitChoice, setSplitChoice] = useState(0);

    const [equalSplit, setEqualSplit] = useState(
        parseFloat(requestAmount) / selectedPeople.length
    );

    useEffect(() => {
        setEqualSplit(parseFloat(requestAmount) / selectedPeople.length);
    }, [requestAmount, selectedPeople.length]);

    function getCleanedURL() {
        return `${window.location.origin}/user/${Util.stringToUrl(
            account.username
        )}/${Util.stringToUrl(requestAmount)}/SOL/for/${Util.stringToUrl(
            description
        )}`;
    }

    async function generateLinkClickedHandler() {
        if (!Util.validateSolanaAddress(walletAddress)) {
            toast.error("Invalid Wallet Address Provided");
            return;
        }

        if (
            await Api.saveTransaction(
                Api.TransactionType.Request,
                account.pubkey,
                "So11111111111111111111111111111111111111112",
                parseFloat(requestAmount),
                description
            )
        ) {
            setShareLinkModalOpen(true);
        }
    }

    function handleRequestAmount(e: any) {
        const { value } = e.target;
        setRequestAmount(Util.stringNumericOnly(value));
    }

    function handleAmountSplitChange(e: any) {
        const { name, value } = e.target;
        let amounts = 0;
        let specific_amount_people = 1;

        const updatedObject = selectedPeople.map((person) => {
            if (person.name === name) {
                amounts += parseFloat(Util.stringNumericOnly(value));
                return {
                    ...person,
                    ["amount"]: Util.stringNumericOnly(value),
                };
            } else if (person.amount) {
                amounts += parseFloat(person.amount);
                specific_amount_people += 1;
            } else {
                return person;
            }
        });

        if (amounts > parseFloat(requestAmount)) {
            // maybe put a toast message here
            return;
        }

        setEqualSplit(
            (parseFloat(requestAmount) - amounts) /
                (selectedPeople.length - specific_amount_people)
        );

        // console.log("BEFORE", newState, newState[name])
        // newState[name]["amount"] = value;
        setSelectedPeople(updatedObject);
    }

    useEffect(() => {
        if (account.connected) {
            setDisableWalletTextbox(true);
            setWalletAddress(account.pubkey);
        } else {
            setDisableWalletTextbox(false);
            setWalletAddress("");
        }
    }, [account.connected]);

    return (
        <div>
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
                button_body={<button>hi</button>}
                handler={"fill in later"}
            />

            <div className={"py-6 sm:py-8 lg:py-12"}>
                <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                    <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-gray-300 md:mb-8 lg:text-3xl">
                        Make Payment Request
                    </h2>

                    <ObjectBg>
                        <div className="flex flex-col gap-y-4">
                            <Textbox
                                label={`Your wallet address`}
                                input_name="wallet_address"
                                value={walletAddress}
                                handler={(e: any) =>
                                    setWalletAddress(e.target.value)
                                }
                                max_length={44}
                                disabled={disableWalletTextbox}
                                validator={
                                    !Util.validateSolanaAddress(
                                        walletAddress
                                    ) && walletAddress != ""
                                }
                                error_text="Invalid Wallet Address"
                            />

                            <div className="flex">
                                <Textbox
                                    label={`Request Amount:`}
                                    input_name="request_amount"
                                    value={requestAmount}
                                    handler={handleRequestAmount}
                                    max_length={8}
                                />
                                <p className="pt-10 px-1">◎</p>
                            </div>

                            <UsernameSearchbox
                                selectedPeople={selectedPeople}
                                setSelectedPeople={setSelectedPeople}
                            />

                            {/* Equal split */}
                            {splitChoice == 0 && (
                                <div>
                                    {selectedPeople &&
                                        selectedPeople.map((person) => (
                                            <div className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
                                                <a
                                                    href={person.href}
                                                    className="inline-flex items-center gap-x-1.5"
                                                >
                                                    <ProfilePicture
                                                        input_username={
                                                            person.name
                                                        }
                                                        image_url={
                                                            person.image_url
                                                        }
                                                        size="small"
                                                    />

                                                    {person?.name}

                                                    <div className="flex flex-row space-x-0.5">
                                                        <TwitterVerifiedBadge
                                                            handle={
                                                                person?.twitter_handle
                                                            }
                                                        />

                                                        <DiscordVerifiedBadge
                                                            id={
                                                                person?.discord_id
                                                            }
                                                        />
                                                    </div>
                                                </a>
                                                <button
                                                    className="inline-flex items-center py-1 h-5"
                                                    onClick={() => {
                                                        setSelectedPeople(
                                                            selectedPeople.filter(
                                                                (a) =>
                                                                    a.name !=
                                                                    person.name
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <RiDeleteBack2Line />
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            )}

                            {/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */}
                            {/* Choose how to split. only show if multiple ppl */}
                            {selectedPeople.length > 1 && (
                                <ButtonGroup
                                    options={["=", "1.23"]}
                                    selected={splitChoice}
                                    handler={setSplitChoice}
                                />
                            )}

                            {/* exact amount split */}
                            {splitChoice == 1 && (
                                <div>
                                    {selectedPeople &&
                                        selectedPeople.map((person) => (
                                            <div className="flex flex-row w-full place-content-between">
                                                <a
                                                    href={person.href}
                                                    className="inline-flex items-center gap-x-1.5"
                                                >
                                                    <ProfilePicture
                                                        input_username={
                                                            person.name
                                                        }
                                                        image_url={
                                                            person.image_url
                                                        }
                                                        size="small"
                                                    />

                                                    {Util.truncate(
                                                        person?.name
                                                    )}

                                                    <div className="flex flex-row space-x-0.5">
                                                        <TwitterVerifiedBadge
                                                            handle={
                                                                person?.twitter_handle
                                                            }
                                                        />

                                                        <DiscordVerifiedBadge
                                                            id={
                                                                person?.discord_id
                                                            }
                                                        />
                                                    </div>
                                                </a>

                                                <div className="inline-flex items-end space-x-1">
                                                    <div className="relative mt-2">
                                                        <input
                                                            type="text"
                                                            name={person.name}
                                                            id={person.name}
                                                            className="peer block w-full border-0 bg-gray-50 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                                                            placeholder={
                                                                !Number.isNaN(
                                                                    equalSplit
                                                                )
                                                                    ? equalSplit.toFixed(
                                                                          2
                                                                      )
                                                                    : "0"
                                                            }
                                                            value={
                                                                person.amount
                                                            }
                                                            onChange={
                                                                handleAmountSplitChange
                                                            }
                                                        />
                                                        <div
                                                            className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600"
                                                            aria-hidden="true"
                                                        />
                                                    </div>
                                                    <button
                                                        className="inline-flex items-center py-1 h-5"
                                                        onClick={() => {
                                                            setSelectedPeople(
                                                                selectedPeople.filter(
                                                                    (a) =>
                                                                        a.name !=
                                                                        person.name
                                                                )
                                                            );
                                                        }}
                                                    >
                                                        <RiDeleteBack2Line />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}

                            {/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */}

                            <Textbox
                                label={`Description:`}
                                input_name="description"
                                value={description}
                                handler={(e: any) =>
                                    setDescription(e.target.value)
                                }
                                max_length={100}
                            />
                        </div>

                        <div className="flex justify-center">
                            <button
                                className={` block w-1/2 rounded-lg bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 px-8 py-3 text-center text-sm font-semibold text-white
                                        outline-none ring-gray-300 
                                        transition duration-100 hover:from-indigo-400 hover:via-sky-400
                                        hover:to-emerald-400 focus-visible:ring md:text-base                  
                                        `}
                                onClick={() => generateLinkClickedHandler()}
                            >
                                Request&nbsp;
                            </button>
                        </div>
                    </ObjectBg>
                </div>
            </div>
        </div>
    );
}
