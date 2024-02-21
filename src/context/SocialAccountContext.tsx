"use client";

import React, { createContext, useContext, useState } from "react";

type SocialAccountContextProviderProps = {
    children: React.ReactNode;
};

interface SocialAccount{
    id: string;
    username: string;
    handle: string;
    image_url: string;
}


type SocialAccountContext = {
    twitter:SocialAccount
    setTwitter: React.Dispatch<React.SetStateAction<SocialAccount>>;

    discord:SocialAccount
    setDiscord: React.Dispatch<React.SetStateAction<SocialAccount>>;
};

const SocialAccountContext = createContext<SocialAccountContext | null>(null);

export function SocialAccountContextProvider({
    children,
}: SocialAccountContextProviderProps) {
    const[twitter, setTwitter] = useState<SocialAccount>({
        id:'',
        username:'',
        handle:'',
        image_url:''
    })

    const[discord, setDiscord] = useState<SocialAccount>({
        id:'',
        username:'',
        handle:'',
        image_url:''
    })

    return (
        <SocialAccountContext.Provider
            value={{
                twitter,
                setTwitter,
                discord,
                setDiscord,
            }}
        >
            {children}
        </SocialAccountContext.Provider>
    );
}

export function useSocialAccountContext() {
    const context = useContext(SocialAccountContext);
    if (!context) {
        throw new Error(
            "useSocialAccountContext must be used withing an SocialAccountContextProvider"
        );
    }
    return context;
}

