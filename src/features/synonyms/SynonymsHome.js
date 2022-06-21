import {useSelector} from "react-redux";
import React, {useState} from "react";
import SynonymFilter from "./SynonymFilter";

export default function SynonymsHome(){
    const title = "Synonyms";

    return(
        <div className="section px-5 pt-4">
            <SynonymFilter />
            <h1>{title}</h1>
        </div>
    )
}