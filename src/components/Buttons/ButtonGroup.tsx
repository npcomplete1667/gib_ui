import React from "react";
import GenericButton from "./GenericButton";
/**
 * options: array of string choices
 * orienation: "row" or "col"
 * select_color: tailwind color
 */

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function ButtonGroup({
    options,
    selected,
    handler,
}: {
    options: any[];
    selected: any;
    handler: any;
}) {
    return (
        <div className={`isolate inline-flex rounded-md shadow-sm`}>
            {options.map((text, index) => {
                if (index == 0) {
                    //beginning item
                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handler(index)}
                            className={classNames(
                                selected == index
                                    ? "bg-gray-100 dark:bg-white/10"
                                    : "bg-white dark:bg-black",
                                "relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 hover:bg-white/20 focus:z-10"
                            )}
                        >
                            {text}
                        </button>
                    );
                } else if (index == options.length - 1) {
                    // end item
                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handler(index)}
                            className={classNames(
                                selected == index
                                    ? "bg-gray-150 dark: dark:bg-white/10"
                                    : "bg-white dark:bg-black",
                                "relative -ml-px inline-flex items-center rounded-r-md  px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 hover:bg-white/20 focus:z-10"
                            )}
                        >
                            {text}
                        </button>
                    );
                } else {
                    //middle items
                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handler(index)}
                            className={classNames(
                                selected == index
                                    ? "bg-gray-100 dark:bg-white/10"
                                    : "bg-white dark:bg-black",
                                "relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 hover:bg-white/20 focus:z-10"
                            )}
                        >
                            {text}
                        </button>
                    );
                }
            })}
        </div>
    );
}

export default ButtonGroup;
