import React, {useEffect} from "react";
import {BsFilePdf} from "react-icons/bs";
import SensitiveCredential from "../../../components/SensitiveCredential";
import {DOCUMENTATION, useSelectedSource} from './common.js';


export default function CrawlerJiraForm(props) {

    // Fetch selected source and calculate source_saved using custom hook
    const {
        selected_source,
        source_saved,
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props);

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

    // this crawler doesn't need the verify system
    useEffect(() => {
        if (props.set_verify) props.set_verify('n/a')
    }, [props.set_verify])

    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            {/**********************************-USERNAME, BASE-URL & PDF-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small required">username</label>
                    <input type="email" className="form-control nfs-width"
                           autoFocus={true}
                           placeholder="username (e.g. name@email.co.uk)"
                           value={specific_json.username}
                           onChange={(event) => {
                               setData({username: event.target.value})
                           }}
                           required
                    />
                </div>
                <div className="form-group col-4">
                    <label className="small required">base url</label>
                    <input type="text" className="form-control nfs-width"
                           placeholder="base url (e.g. https://simsage.atlassian.net)"
                           value={specific_json.jira_base_url}
                           onChange={(event) => {
                               setData({jira_base_url: event.target.value})
                           }}
                           required
                    />
                </div>
                <div className="col-2 offset-1">
                    <a href={DOCUMENTATION.JIRA} id="dlGDrive" target="_blank" rel="noreferrer"
                       title="Download the SimSage Jira setup guide" className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>Jira <br/>Setup Guide
                    </a>
                </div>
            </div>
            {/**********************************-API TOKEN & BOARD KEY-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-5">
                    <SensitiveCredential
                        selected_source={selected_source}
                        specific_json={specific_json.api_token}
                        onChange={(event) => {
                            setData({api_token: event.target.value})
                        }}
                        name="API Token"
                        required={!source_saved}
                    />
                </div>
                <div className="form-group col-3">
                    <label className="small required">board key</label>
                    <input type="text" className="form-control nfs-width"
                           placeholder="board key (e.g. SM, BR, SIM)"
                           value={specific_json.board_key}
                           onChange={(event) => {
                               setData({board_key: event.target.value})
                           }}
                           required
                    />
                </div>
            </div>
        </div>
    )
}
