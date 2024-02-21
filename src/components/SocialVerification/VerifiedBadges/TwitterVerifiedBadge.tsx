import React from "react";
import { FaSquareXTwitter } from "react-icons/fa6";
import { Tooltip } from "@geist-ui/core";

function TwitterVerifiedBadge({
    handle,
    disabled = false,
}: {
    handle: string;
    disabled?: boolean;
}) {
    if (handle) {
        return (
            <a
                href={`https://twitter.com/${handle}`}
                onClick={(e) => {
                    if (disabled) {
                        e.preventDefault();
                    }
                }}
                target="_blank"
            >
                <FaSquareXTwitter className="text-gray-800 h-3 w-3" />
            </a>
        );
    }
}

export default TwitterVerifiedBadge;
