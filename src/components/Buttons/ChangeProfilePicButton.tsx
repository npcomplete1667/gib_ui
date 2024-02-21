//*************INCOMPLETE NEED TO ADD S3 Connection to upload images */

import React from "react";
import ProfilePicture from "../ProfilePicture";

function ChangeProfilePicButton({ username, size}: { username: string, size:"large" | "medium" | "small" }) {
    return (
        <div className="mt-2 flex items-center gap-x-3">
            <ProfilePicture input_username={username} size={size} />

            <button
                type="button"
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
                Change
            </button>
        </div>
    );
}

export default ChangeProfilePicButton;
