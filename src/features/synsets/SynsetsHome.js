import {useSelector} from "react-redux";
import React, {useState} from "react";
import SynsetFilter from "./SynsetFilter";

export default function SynsetsHome(){
    const title = "Synsets";

    return(
        <div className="section px-5 pt-4">
            <SynsetFilter />
            <h1>{title}</h1>
        </div>
    )
}