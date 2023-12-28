import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { ThemeProvider } from "../context/ThemeProvider";
import { ThemeSwitcher } from "../components/Buttons/ThemeSwitcher";
import { Toaster } from "sonner";

const WalletConnectionProvider = dynamic(
    () => import("../context/WalletConnectionProvider"),
    {
        ssr: false,
    }
);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Tip",
    description: "Tip with a link",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <link
                rel="icon"
                href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤑</text></svg>"
            />
            <body className={`${inter.className} bg-siteBg duration-200`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <ThemeSwitcher />
                    <Toaster
                        richColors
                        // theme={theme == "light" ? "light" : "dark"}
                        position="bottom-left"
                        closeButton
                    />

                    <WalletConnectionProvider>
                        {children}
                    </WalletConnectionProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
