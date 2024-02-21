import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import dynamic from "next/dynamic";

import { Toaster } from "sonner";
import Util from "@/Util";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
require("@solana/wallet-adapter-react-ui/styles.css");

//Themes
import { ThemeProvider } from "../context/ThemeProvider";
import { NextAuthProvider } from "@/context/NextAuthProvider";
import { AccountContextProvider } from "@/context/AccountContext";
import { SocialAccountContextProvider } from "@/context/SocialAccountContext";
const WalletConnectionProvider = dynamic(
    () => import("../context/WalletConnectionProvider"),
    {
        ssr: false,
    }
);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "gib",
    description: "Tip with a link",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <link rel="icon" href={Util.getEmojiHref("💸")} />
            <body
                className={`${inter.className} bg-siteBg duration-200 flex flex-col min-h-screen`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <Toaster
                        richColors
                        // theme={theme == "light" ? "light" : "dark"}
                        position="bottom-left"
                        closeButton
                    />

                    <NextAuthProvider>
                        <WalletConnectionProvider>
                            <AccountContextProvider>
                                <SocialAccountContextProvider>
                                    <Header />
                                    {children}
                                    <Footer />
                                </SocialAccountContextProvider>
                            </AccountContextProvider>
                        </WalletConnectionProvider>
                    </NextAuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
