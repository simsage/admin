import {useSelector} from "react-redux";
import React, {useState} from "react";
import SemanticsFilter from "./SemanticsFilter";

export default function SemanticsHome(){
    const title = "Semantics";

    return(
        <div className="section px-5 pt-4">
            <SemanticsFilter />
            <h1>{title}</h1>
        </div>
    )
}