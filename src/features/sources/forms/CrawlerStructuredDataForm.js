import React, {useEffect} from "react";
import {Editor} from "@monaco-editor/react";
import {BsFilePdf} from "react-icons/bs";
import {configureMonaco} from "../../../common/monaco";
import {DOCUMENTATION, useSelectedSource} from "./common";


export default function CrawlerStructuredDataForm(props) {

    // Fetch selected source and calculate source_saved using custom hook
    const {
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props);

    //update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({...specific_json, ...data})
    }

    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson: specific_json_stringify})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])


    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-4">
                <div className="form-group col-10">
                    <label className="medium">Configuration Yaml for the crawler</label>
                    <Editor
                        className={"monaco_yaml"}
                        beforeMount={configureMonaco}
                        path="sdc.yml"
                        height="500px"
                        language="yaml"
                        value={specific_json.yml ? specific_json.yml : ""}
                        onChange={(value) => {
                            setData({yml: value})
                        }}
                    />

                </div>
                <div className="col-2">
                    <a href={DOCUMENTATION.STRUCTURED} id="dlBox" target="_blank"
                       title="Download the SimSage Structured Data Crawler setup guide"
                       className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>Structured Data Crawler <br/>Setup Guide
                    </a>
                </div>
            </div>
        </div>
    )
}