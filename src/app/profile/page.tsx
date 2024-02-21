"use client";

// React/Node
import { useState, useEffect } from "react";
//components
import ProfilePicture from "@/components/ProfilePicture";
import ObjectBg from "@/components/Layout/ObjectBg";
import Textbox from "@/components/Textbox";
import {SocialVerifyGroup} from "@/components/Buttons";
import Tip from "@/components/Tip";
import Toggle from "@/components/Toggle";

//assets
import { IoMdInformationCircleOutline } from "react-icons/io";

//Context
import { useAccountContext } from "@/context/AccountContext";
import { useSocialAccountContext } from "@/context/SocialAccountContext";

//Util
import Util from "@/Util";
import Api from "@/server-actions/Api";
import { Divider, Tooltip } from "@geist-ui/core";

//Solana
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import DiscordVerifiedBadge from "@/components/SocialVerification/VerifiedBadges/DiscordVerifiedBadge";
import TwitterVerifiedBadge from "@/components/SocialVerification/VerifiedBadges/TwitterVerifiedBadge";

//style
require("@solana/wallet-adapter-react-ui/styles.css");

export default function ProfilePage() {
    const {
        account,
        setAccount
    } = useAccountContext();
    const {
        twitter,
        discord,
    } = useSocialAccountContext();
    const [tempUsername, setTempUsername] = useState<string>(account.username);
    const [payDev, setPayDev] = useState<boolean>(account.pay_dev)

    useEffect(() => {
        setTempUsername(account.username);
    }, [account.username]);

    useEffect(() => {
        setPayDev(account.pay_dev);
    }, [account.pay_dev]);

    useEffect(() => {
    }, [account.connected]);

    function handleUsernameChange(e: any) {
        const value = e.target.value;
        const cleanedUsername = Util.stringToUrl(value);
        setTempUsername(cleanedUsername);
    }



    function saveSettings() {
        Api.updateAccount(account.id, tempUsername, payDev, account.pfp_provider)
    }

    return (
        <div>
            {account.connected ? (
                <>
                    <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-gray-300 md:mb-8 lg:text-3xl">
                        My Profile
                    </h2>
                    <ObjectBg>
                        <div className="flex justify-center flex-col items-center">
                            <Tooltip
                                text={
                                    <div className="flex flex-col">
                                        <button
                                            title="twitterpfp"
                                            type="button"
                                            onClick={() =>
                                                setAccount({...account, pfp_provider:"twitter"})
                                            }
                                        >
                                            use twitter profile picture
                                        </button>
                                        <Divider />
                                        <button
                                            title="discordpfp"
                                            type="button"
                                            onClick={() =>
                                                setAccount({...account, pfp_provider:"discord"})
                                            }
                                        >
                                            use discord profile picture
                                        </button>
                                    </div>
                                }
                                placement="right"
                                visible={
                                    discord.image_url != null &&
                                    twitter.image_url != null
                                }
                            >
                                <ProfilePicture
                                    input_username={tempUsername}
                                    size="large"
                                />
                            </Tooltip>
                            <div className="grid grid-cols-2 gap-x-1">
                                <TwitterVerifiedBadge />
                                <DiscordVerifiedBadge />
                            </div>
                        </div>
                        <Textbox
                            label="Username"
                            input_name="username"
                            value={tempUsername}
                            handler={handleUsernameChange}
                            max_length={16}
                        />

                        <SocialVerifyGroup/>
                        <Tip/>
                        <Toggle title="Give dev 0.05%?"
                        tooltip={
                            <Tooltip
                            text={
                                "0.05% of transactions helps keeps things\n running and will allow me to do this full time"
                            }
                            placement="bottom"
                        >
                            <IoMdInformationCircleOutline className="h-5 w-5 items-center" />
                        </Tooltip>
                        }
                        enabled={payDev}
                        setEnabled={setPayDev}
                        />
                        
                        {/* Cancel and Save Section */}
                        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                            <button
                                type="button"
                                className="text-sm font-semibold leading-6 text-gray-900"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                onClick={saveSettings}
                            >
                                Save
                            </button>
                        </div>
                    </ObjectBg>
                </>
            ) : (
                <>
                    <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-gray-300 md:mb-8 lg:text-3xl">
                        Sign In to Access your Profile
                    </h2>
                    <ObjectBg>
                        <div className="flex items-center justify-center">
                            <WalletMultiButton />
                        </div>
                    </ObjectBg>
                </>
            )}
        </div>
    );
}
