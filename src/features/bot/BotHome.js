import {useSelector} from "react-redux";
import React, {useState} from "react";
import BotFilter from "./BotFilter";

export default function BotHome(){
    const title = "Bot";

    return(
        <div className="section px-5 pt-4">

            <BotFilter />
            <h1>{title}</h1>
        </div>
    )
}