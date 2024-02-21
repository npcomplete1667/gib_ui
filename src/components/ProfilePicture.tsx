import Image from "next/image";
import { Divider, Tooltip } from "@geist-ui/core";
import { useState, useEffect } from "react";
import Api from "@/server-actions/Api";
import { useAccountContext } from "@/context/AccountContext";
import { useSocialAccountContext } from "@/context/SocialAccountContext";
import { toast } from "sonner";
import Util from "@/Util";

//assets
import { CiWallet } from "react-icons/ci";




export default function ProfilePicture({
    input_username,
    image_url,
    size,
}: {
    input_username?: string;
    image_url?: string;
    size:"large" | "medium" | "small";
}) {
    // useEffect(() => {
    //     console.log("IN OFO", pfpProvider, pfpProvider == "twitter");
    //     if (pfpProvider == "twitter") {
    //         setProfilePicture(twitterImageUrl);
    //     }
    //     if (pfpProvider == "discord") {
    //         setProfilePicture(discordImageUrl);
    //     }
    // }, [pfpProvider]);
    const {account} = useAccountContext();
    const {twitter, discord} = useSocialAccountContext();
    const [username, setUsername] = useState<string>(input_username ? input_username : account.username)
    const [pfp, setPfp] = useState<string>(getPfp())

    const image_sizes = {
        "large" : {
            "initial" : "h-24 w-24",
            "picture": 96
        },
        "medium" : {
            "initial" : "h-12 w-12",
            "picture": 48
        },
        "small" : {
            "initial" : "h-6 w-6 text-xs",
            "picture": 24
        }
    }

    function getPfp(){
            if (image_url){
                return image_url
            }
            if (account.pfp_provider == "twitter"){
                return twitter.image_url
            } 
            if (account.pfp_provider == "discord"){
                return discord.image_url
            } 
            return ""
    }

    useEffect(() => {
        setPfp(getPfp())
    }, [account.pfp_provider])

    
    


    function makeInitials(input: string, max_length: number) {
        //get capital letters
        let res = input.replace(/[a-z0-9]/g, "");
        if (res !== "") return res.substring(0, max_length);

        //get whatever if below x characters
        if (input.length < max_length) {
            res = input.replace(/[0-9]/g, "");
            if (res !== "") return res.substring(0, max_length);
        }

        //no capital letters
        //get lower case without vowels
        res = input.replace(/[aeiou0-9]/gi, "");
        return res.substring(0, max_length);
    }

    if (pfp == "wallet") {
        return <CiWallet className={Util.classNames(image_sizes[size]["initial"],"flex-shrink-0 rounded-full")} />;
    } else if (pfp) {
        return (
            <Image
                src={pfp}
                width={image_sizes[size]["picture"]}
                height={image_sizes[size]["picture"]}
                alt="profile-image"
                className="rounded-full"
            />
        );
    }else{
        return (
            <>
                <span
                    className={Util.classNames(image_sizes[size]["initial"],"inline-flex items-center justify-center rounded-full bg-gray-500")}
                >
                    <span className="font-medium leading-none text-white">
                        {makeInitials(username, 4)}
                    </span>
                </span>
            </>
        );
    }
}
