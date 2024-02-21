import { useState, useEffect } from "react";

export default function SocialVerifyButton({
    color,
    handle,
    icon,
    handler,
}: {
    color:string;
    handle:string;
    icon: any;
    handler: any;
}) {
    const [buttonText, setButtonText] = useState("Connect");

    useEffect(() => {
        if (handle != ""){
            setButtonText(handle)
        } else {
            setButtonText("Connect")
        }
            
    },[handle])

    return (
        <>
            <button
                className={`flex h-12 justify-center items-center align-center space-x-2 ${color} text-white rounded`}
                onClick={handler}
                onMouseEnter={() => setButtonText(handle ? "Change Account" : "Connect")}
                onMouseLeave={() => setButtonText(handle ? handle : "Connect")
                }
            >
                <p>{buttonText}</p>
                {icon}
            </button>
        </>
    );
}
