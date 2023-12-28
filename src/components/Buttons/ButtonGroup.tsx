import React from "react";
import GenericButton from "./GenericButton";
/**
 * options: array of string choices
 * orienation: "row" or "col"
 * select_color: tailwind color
 */

function ButtonGroup({
    options,
    orientation,
    select_color,
    select_criteria,
    handler,
}: {
    options: any[];
    orientation: string;
    select_color: string;
    select_criteria: any;
    handler: any;
}) {
    return (
        <div className={`flex flex-${orientation} justify-center`}>
            {options.map((text, index) => {
                return (
                    <GenericButton
                        key={index}
                        id={index}
                        text={text}
                        color={select_color}
                        isSelected={index == select_criteria}
                        handler={handler}
                    />
                );
            })}
        </div>
    );
}

export default ButtonGroup;
