import React, { useEffect } from "react";
import SocialVerifyButton from "./SocialVerifyButton";
import { useSocialAccountContext } from "@/context/SocialAccountContext";
import { FaDiscord } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import Api from "@/server-actions/Api";
import { useAccountContext } from "@/context/AccountContext";

import { useSession, signIn, signOut } from "next-auth/react";

function SocialVerifyGroup() {
    const { twitter,discord } = useSocialAccountContext();
    const { account } = useAccountContext();

    const { data: session } = useSession();

    if (session) {
        console.log("SESSIONG OUTSIDE", session);
        Api.saveSocialAccount(
            session.user.id,
            account.id,
            session.user.provider,
            session.user.name,
            session.user.handle,
            session.user.email,
            session.user.image
        );
        signOut();
    }

    return (
        <div className="grid grid-cols-2 gap-x-6">
            <SocialVerifyButton
                color="bg-gray-800"
                handle={twitter.handle}
                handler={() => signIn("twitter")}
                icon={<FaSquareXTwitter />}
            />

            <SocialVerifyButton
                color="bg-indigo-500"
                handle={discord.handle}
                handler={() => signIn("discord")}
                icon={<FaDiscord />}
            />
        </div>
    );
}

export default SocialVerifyGroup;
