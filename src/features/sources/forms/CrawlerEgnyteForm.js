import React, {useEffect} from "react";
import {BsFilePdf} from "react-icons/bs";
import SensitiveCredential from "../../../components/SensitiveCredential";
import {DOCUMENTATION, useSelectedSource} from './common.js';


export default function CrawlerEgnyteForm(props) {

    // Fetch selected source and calculate source_saved using custom hook
    const {
        selected_source,
        source_saved,
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props);

    // update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({...specific_json, ...data})
    }

    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson: specific_json_stringify})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])

    // this crawler doesn't need the verify system
    useEffect(() => {
        if (props.set_verify) props.set_verify('n/a')
    }, [props.set_verify])

    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            {/**********************************-USERNAME, DOMAIN & PDF-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small required">Username</label>
                    <input type="text" className="form-control nfs-width"
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
                    <label className="small required">Domain</label>
                    <input type="text" className="form-control nfs-width"
                           placeholder="E.g., app4simsage (exclude https:// & egnyte.com)"
                           value={specific_json.domain}
                           onChange={(event) => {
                               setData({domain: event.target.value})
                           }}
                           required
                    />
=                </div>
                <div className="col-2 offset-1">
                    <a href={DOCUMENTATION.EGNYTE} id="dlGDrive" target="_blank" rel="noreferrer"
                       title="Download the SimSage Egnyte setup guide"
                       className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>Egnyte <br/>Setup Guide
                    </a>
                </div>
            </div>
            {/**********************************-PASSWORD & CLIENT ID-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-6">
                    <SensitiveCredential
                        selected_source={selected_source}
                        specific_json={specific_json.password}
                        onChange={(event) => {
                            setData({password: event.target.value})
                        }}
                        name="Password"
                        required={!source_saved}
                    />
                </div>
                <div className="form-group col-4">
                    <label className="small required">Client ID</label>
                    <input type="text" className="form-control nfs-width"
                           placeholder="client ID"
                           value={specific_json.client_id}
                           onChange={(event) => {
                               setData({client_id: event.target.value})
                           }}
                           required
                    />
                </div>
            </div>
            {/**********************************-CLIENT SECRET, GRANT TYPE & PATH-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-6">
                    <SensitiveCredential
                        selected_source={selected_source}
                        specific_json={specific_json.client_secret}
                        onChange={(event) => {
                            setData({client_secret: event.target.value})
                        }}
                        name="Client Secret"
                        required={!source_saved}
                    />
                </div>
                <div className="form-group col-4">
                    <label className="small required">Root Path</label>
                    <input type="text" className="form-control nfs-width"
                           placeholder="root path"
                           value={specific_json.root_path}
                           onChange={(event) => {
                               setData({root_path: event.target.value})
                           }}
                           required
                    />
                </div>
            </div>
        </div>
    )
}
