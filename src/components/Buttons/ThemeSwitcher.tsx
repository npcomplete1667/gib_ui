"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";

export const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className=" p-1 w-16 h-8 flex items-center dark:bg-gray-600 bg-teal-500 cursor-pointer rounded-full"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>

            <FaMoon className="text-white" size={18} />

            {/* white ball */}
            <div
                className={`absolute bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${theme === "dark" ? "none": "translate-x-8"}`}
            >
            </div>

            <BsSunFill className="ml-auto text-yellow-400" size={18} />
        </div>
    );
};
