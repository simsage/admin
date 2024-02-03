import React, {useEffect, useState} from "react";
import {BsFilePdf} from 'react-icons/bs'
import SensitiveCredential from "../../../components/SensitiveCredential";

export default function CrawlerDiscourseForm2(props){


    const selected_source = props.source;
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))
    const l_form_data = props.form_data;

    //update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({...specific_json,...data})
    }


    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson:specific_json_stringify})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])


    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-4">
                <div className="col-9">
                    <div className="row mb-4">
                        <div className="form-group col-4">
                            <label className="small required">Server hostname</label>
                            <form>
                                <input type="text" className="form-control"
                                    autoFocus={true}
                                    placeholder="e.g. discourse.simsage.ai"
                                    value={specific_json.server}
                                    onChange={(event) => {setData({server: event.target.value})}}
                                />
                            </form>
                        </div>
                        <div className="form-group col-8">
                            <SensitiveCredential
                                selected_source={selected_source}
                                specific_json={specific_json.apiToken}
                                onChange={(event) => {setData({apiToken: event.target.value})}}
                                name="API Token"
                            />
                        </div>
                    </div>
                </div>
                <div className="col-2 offset-1">
                    <a href="resources/discourse-setup.pdf" id="dlDiscourse" target="_blank"
                    title="Download the SimSage Discourse setup guide" className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                    <BsFilePdf size={25}/>
                    <span className="me-2 mt-2"></span>Discourse <br/>Setup Guide 
                    </a>
                </div>
            </div>

        </div>);
}