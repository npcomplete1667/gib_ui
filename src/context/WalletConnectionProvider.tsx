"use client";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    TorusWalletAdapter,
    SolflareWalletAdapter,
    CloverWalletAdapter,
    CoinbaseWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { useMemo } from "react";


const WalletConnectionProvider = ({ children }:{ children:any }) => {
    const endpoint:string = useMemo(() => process.env.NEXT_PUBLIC_ENDPOINT_URL, [])!;

    const wallets = useMemo(() => [
        new PhantomWalletAdapter(),
        new TorusWalletAdapter(),
        new SolflareWalletAdapter(),
        new CloverWalletAdapter,
        new CoinbaseWalletAdapter,
        new LedgerWalletAdapter(),
    ], []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default WalletConnectionProvider;
