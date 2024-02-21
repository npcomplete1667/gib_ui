"use client";

import React, { createContext, useContext, useState } from "react";

type AccountContextProviderProps = {
    children: React.ReactNode;
};

interface Account{
    id:string;
    connected:boolean;
    pubkey:string;
    username:string;
    pay_dev:boolean;
    pfp_provider:string;
}

type AccountContext = {
    account:Account;
    setAccount:React.Dispatch<React.SetStateAction<Account>>;
};

const AccountContext = createContext<AccountContext | null>(null);

export function AccountContextProvider({
    children,
}: AccountContextProviderProps) {
    const [account, setAccount] = useState<Account>({
        id:'',
        connected:false,
        pubkey:'',
        username:'',
        pay_dev:false,
        pfp_provider:''
    })

    return (
        <AccountContext.Provider
            value={{
                account,
                setAccount
            }}
        >
            {children}
        </AccountContext.Provider>
    );
}

export function useAccountContext() {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error(
            "useAccountContext must be used withing an AccountContextProvider"
        );
    }
    return context;
}

