import {useSelector} from "react-redux";
import React, {useState} from "react";
import SourceFilter from "./SourceFilter";

export default function SourceHome(){
    const title = "Source";

    return(
        <div className="section px-5 pt-4">

            <SourceFilter />

            <h1>{title}</h1>
        </div>
    )
}