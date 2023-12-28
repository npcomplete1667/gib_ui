import React from "react";

function Divider({ text }: { text: string }) {
    return (
        <div className="relative flex items-center justify-center">
            <span className="absolute inset-x-0 h-px bg-gray-300 dark:bg-gray-700"></span>
            <span
                className="relative bg-objectBg px-4 text-sm text-gray-500 dark:text-gray-300"
            >
                {text}
            </span>
        </div>
    );
}

export default Divider;
