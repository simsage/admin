import React, {useEffect} from "react";
import {invalid_credential, useSelectedSource} from "./common";

export default function CrawlerRestfulForm(props) {

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


    useEffect(() => {

        const validateRestfull = () => {
            const {template, text, content_url, url} = specific_json
            let missing = []

            if (invalid_credential(url))
                missing.push("url")

            if (invalid_credential(content_url))
                missing.push("content_url")

            if (props.source.customRender && (invalid_credential(template) || invalid_credential(text)))
                missing.push("text-template")

            if (props.source.customRender && (invalid_credential(content_url)))
                missing.push("text template")

            return missing.length > 0  ? `Database Crawler: please provide the ${missing.join(", ")}` : null
        }

        if (props.set_verify) props.set_verify(() => validateRestfull)
    }, [props.set_verify])


    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-4">
                <div className="form-group col-6">
                    <label className="small required">API URL</label>
                    <input type="text" className="form-control"
                           placeholder="JSON url (will grab the first list inside it can find as the source)"
                           autoFocus={true}
                           value={specific_json.url}
                           onChange={(event) => {
                               setData({url: event.target.value})
                           }}
                    />
                </div>
            </div>
            <div className="row mb-4">
                <div className="form-group col-6">
                    <label className="small required">Record Primary Key</label>
                    <input type="text" className="form-control"
                           placeholder="a url based on text and JSON fields in square brackets [FIELD-NAME]"
                           autoFocus={true}
                           value={specific_json.content_url}
                           onChange={(event) => {
                               setData({content_url: event.target.value})
                           }}
                    />
                </div>
            </div>
            <div className="row mb-4">
                <div className="form-group col-9">
                    <label className="small">Text Index Template</label>
                    <textarea className="form-control"
                              placeholder="REST text index template, an text template referencing REST fields in square brackets [FIELD-NAME]"
                              rows={5}
                              value={specific_json.text}
                              onChange={(event) => {
                                  setData({text: event.target.value})
                              }}
                    />
                </div>
            </div>
        </div>
    )
}