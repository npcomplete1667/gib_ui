import React from "react";

function ObjectBg({
    children,
    footer,
}: {
    children: React.ReactNode;
    footer?: any;
}) {
    return (
        <div className="bg-objectBg mx-auto w-full max-w-lg rounded-lg border dark:border-gray-700 m-8">
            <div className="flex flex-col gap-4 p-4 md:p-8">{children}</div>
            {footer && (
                <div className="flex items-center justify-center bg-gray-200 dark:dark:bg-white/5 p-4">
                    <p className="text-center text-sm text-gray-500">
                        {footer}
                    </p>
                </div>
            )}
        </div>
    );
}

export default ObjectBg;
