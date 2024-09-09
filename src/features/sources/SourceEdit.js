import {useSelector} from "react-redux";
import SourceForm from "./SourceForm";
import "../../css/crawler.css"
import React from "react";
import SourceTest from "./SourceTest";


export default function SourceEdit() {

    const show_form = useSelector((state) => state.sourceReducer.show_data_form);
    const test_result = useSelector((state) => state.sourceReducer.test_result);

    if (!show_form)
        return <div/>

    return (
        <>
            <SourceForm/>
            {test_result && <SourceTest/>}
        </>
    )
}