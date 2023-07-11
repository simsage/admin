import React from "react";
import BotList from "./BotList"
import {BotErrorDialog} from "./BotErrorDialog";

export default function BotHome() {

    return (
        <div className="">
            <BotList />
            <BotErrorDialog/>
        </div>
    )

}