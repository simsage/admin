import {useSelector} from "react-redux";
// import {useForm} from "react-hook-form";
// import {closeForm} from "./sourceSlice";
import SourceForm from "./SourceForm";
import "../../css/crawler.css"
import AlertDialogHome from "../alerts/AlertDialogHome";
import React from "react";

export default function SourceEdit(){

    // const theme = '';
    const show_form = useSelector((state)=> state.sourceReducer.show_data_form);



    if (!show_form)
        return (<div/>);
    return (
        <>
            <SourceForm />

            <AlertDialogHome />
        </>

    );
}