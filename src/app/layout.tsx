import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { ThemeProvider } from "../context/ThemeProvider";
import { Toaster } from "sonner";
import Util from "@/Util";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


const WalletConnectionProvider = dynamic(
    () => import("../context/WalletConnectionProvider"),
    {
        ssr: false,
    }
);

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//     title: "gib",
//     description: "Tip with a link",
// };

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

                    <WalletConnectionProvider>
                        <Header />
                        {children}
                    </WalletConnectionProvider>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
