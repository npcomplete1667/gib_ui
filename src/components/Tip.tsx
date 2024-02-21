import React from "react";
import ProfilePicture from "./ProfilePicture";
import { useAccountContext } from "@/context/AccountContext";
import { VerifiedBadgeGroup } from "./SocialVerification/VerifiedBadges";
import Util from "@/Util";
import { useSocialAccountContext } from "@/context/SocialAccountContext";
import {
    TwitterVerifiedBadge,
    DiscordVerifiedBadge,
} from "./SocialVerification/VerifiedBadges";

function Tip() {
    const { account } = useAccountContext();
    const {twitter, discord} = useSocialAccountContext();

    return (
        <div className="mt-2 h-16 w-full rounded-md border-0 disabled:opacity-75 bg-white dark:bg-white/5 py-1.5 pl-3 pr-4 text-gray-800 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 flex flex-row items-center justify-between">
            <div className="flex flex-row items-center space-x-5">
                <ProfilePicture size="medium" />
                <div className="flex flex-row items-center space-x-1">
                    <p>{account.username}</p>
                    <div className="grid grid-cols-2">
                        <TwitterVerifiedBadge handle={twitter.handle}/>
                        <DiscordVerifiedBadge id={discord.id}/>
                    </div>
                </div>
            </div>
            <div>
                <a
                    href={
                        `${window.location.origin}/user/` +
                        Util.stringToUrl(account.username)
                    }
                    className="text-sm text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
                >
                    <div className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        <p>Tip</p>
                    </div>
                </a>
            </div>
        </div>
    );
}

export default Tip;
