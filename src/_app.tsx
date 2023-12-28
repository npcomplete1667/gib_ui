import dynamic from "next/dynamic";
import Head from "next/head";
import type { AppProps } from "next/app";
import "../styles/globals.css";

const WalletConnectionProvider = dynamic(
    () => import("./context/WalletConnectionProvider"),
    {
        ssr: false,
    }
);

function MyApp({ Component, pageProps }:AppProps) {
    return (
        <>
            <Head>
                <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤑</text></svg>"/>
                <title>Tip</title>
            </Head>
            <WalletConnectionProvider>
                <Component {...pageProps} />
            </WalletConnectionProvider>
        </>
    );
}

export default MyApp;
