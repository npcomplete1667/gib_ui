import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import Api from "@/server-actions/Api";
import Util from "@/Util";
import {
    TwitterVerifiedBadge,
    DiscordVerifiedBadge,
} from "./SocialVerification/VerifiedBadges";
import ProfilePicture from "@/components/ProfilePicture";


import { useAccountContext } from "@/context/AccountContext";

interface person {
    name: string;
    image_url: string | undefined;
    href: string | undefined;
    amount: string | undefined;
    twitter_handle: string | undefined;
    discord_id: string | undefined;
}

export default function UsernameSearchbox({selectedPeople, setSelectedPeople}:{selectedPeople:person[], setSelectedPeople:Dispatch<SetStateAction<person[]>>}) {
    const [query, setQuery] = useState("");
    const [items, setItems] = useState<any[]>();
    const { account } = useAccountContext();

    function handleTextChange(e: any) {
        const text_value = e.target.value;
        if (text_value === "") {
            setQuery("");
            setItems(undefined);
            return;
        }

        if (
            account.pubkey != text_value &&
            Util.validateSolanaAddress(text_value) &&
            selectedPeople.filter((entry) => entry.name == text_value).length ==
                0
        ) {
            setItems([
                {
                    name: text_value,
                    image_url: "wallet",
                    href: `https://solscan.io/account/${text_value}`,
                },
            ]);
        } else {
            let res: any[] = [];
            Api.getUsernameLike(text_value.toLowerCase()).then((result) => {
                for (let i = 0; i < result.length; i++) {
                    if (
                        result[i]["username"] != account.username &&
                        selectedPeople.filter(
                            (entry) => entry.name == result[i]["username"]
                        ).length == 0
                    ) {
                        res.push({
                            name: result[i]["username"],
                            image_url: result[i]["image_url"],
                            twitter_handle: result[i]["twitter_handle"],
                            discord_id: result[i]["discord_id"],
                            href: "#",
                            //NP add this later
                            // `${window.location.origin}/user/${result[i]["username"]}`
                        });
                    }
                }
                console.log(res);
                setItems(res);
            });
        }
        setQuery(text_value);
    }

    // useEffect(() => {
    //     if (items) {
    //         setSelectedPerson(items[0]);
    //     }
    // }, [items]);

    const filteredPeople = items
        ? items.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase());
          })
        : [];

    return (
        <Combobox
            as="div"
            value={selectedPeople}
            onChange={(e: any) => {
                setSelectedPeople(e);
            }}
            multiple
        >
            <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                Request From:
            </Combobox.Label>
            <div className="relative mt-2">
                <Combobox.Input
                    className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={handleTextChange}
                    // displayValue={(person) => person?.name}
                    autoComplete="off"
                    // onSubmit={(e) => {
                    //     e.preventDefault();
                    //     items ? setSelectedPeople(items[0]) : "";
                    // }}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                    />
                </Combobox.Button>

                <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <Combobox.Option
                        key={1}
                        value={"default prompt"}
                        className={({ active }) =>
                            Util.classNames(
                                "relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900"
                            )
                        }
                    >
                        {query.length > 0 && items?.length == 0
                            ? "No users found"
                            : "Try searching for people or wallet addresses"}
                    </Combobox.Option>
                </Combobox.Options>

                {/* && filteredPeople.length > 0 */}
                {filteredPeople && (
                    <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredPeople.map((person) => (
                            <Combobox.Option
                                key={person.id}
                                value={person}
                                className={({ active }) =>
                                    Util.classNames(
                                        "relative cursor-default select-none py-2 pl-3 pr-9",
                                        active
                                            ? "bg-indigo-600 text-white"
                                            : "text-gray-900"
                                    )
                                }
                            >
                                {({ active, selected }) => (
                                    <>
                                        <div className="flex items-center">
                                            <ProfilePicture input_username={person.name} image_url={person.image_url} size="small"/>

                                            <span
                                                className={Util.classNames(
                                                    "ml-3 truncate",
                                                    selected && "font-semibold"
                                                )}
                                            >
                                                <div className="flex space-x-1 items-center">
                                                    <p>{person.name}</p>

                                                    <div className="flex flex-row space-x-0.5">
                                                        <TwitterVerifiedBadge
                                                            handle={
                                                                person?.twitter_handle
                                                            }
                                                            disabled={true}
                                                        />
                                                        <DiscordVerifiedBadge
                                                            id={
                                                                person?.discord_id
                                                            }
                                                            disabled={true}

                                                        />
                                                    </div>
                                                </div>
                                            </span>
                                        </div>

                                        {selected && (
                                            <span
                                                className={Util.classNames(
                                                    "absolute inset-y-0 right-0 flex items-center pr-4",
                                                    active
                                                        ? "text-white"
                                                        : "text-indigo-600"
                                                )}
                                            >
                                                <CheckIcon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        )}
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                )}
            </div>
        </Combobox>
    );
}
