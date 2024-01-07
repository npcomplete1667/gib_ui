import React, { useEffect, useState } from "react";
import Divider from "./Layout/Divider";
import ObjectBg from "./Layout/ObjectBg";

function Leaderboard({ title, items }: { title: string; items?: any[][] }) {
    return (
        <ObjectBg>
            <h4>{title}</h4>

            <Divider />
            <div className="grid grid-cols-12 text-start px-1">
                <div className="col-span-1"></div>
                <div className="col-span-8 undr">Account</div>
                <div className="col-span-3 text-center">Amount</div>
            </div>
            {items && items.length !== 0 && (
                <ol>
                    {items.map((value, index) => {
                        return (
                            <li key={index}>
                                <div className="grid grid-cols-12 text-start p-1">
                                    <div className="col-span-1">
                                        {index + 1}.
                                    </div>
                                    <div className="col-span-8">{value[0]}</div>
                                    <div className="col-span-3 text-left">
                                        ${value[1].toFixed(2)}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            )}
        </ObjectBg>
    );
}

export default Leaderboard;
