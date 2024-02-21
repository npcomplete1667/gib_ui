import React from "react";
import { FaDiscord } from "react-icons/fa";


function DiscordVerifiedBadge({id, disabled=false} : {id:string, disabled?:boolean}) {

    if (id) {
        return (
            <a
                href={`https://discordapp.com/users/${id}`}
                target="_blank"
                onClick={(e) => {
                    if (disabled) {
                        e.preventDefault();
                    }
                }}
            >
                    <FaDiscord className="text-indigo-500 h-3 w-4" />
            </a>
        );
    }
}

export default DiscordVerifiedBadge;
