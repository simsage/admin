import {useSelector} from "react-redux";
import React, {useState} from "react";

export default function BotHome(){
    const title = "Bot";

    return(
        <div className="section px-5 pt-4">
            <h1>{title}</h1>
        </div>
    )
}