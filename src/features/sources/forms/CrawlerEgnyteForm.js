import React, {useEffect, useState} from "react";
import Api from "../../../common/api";
import {BsFilePdf} from "react-icons/bs";

export default function CrawlerEgnyteForm(props) {

    const selected_source = props.source;

    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
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
            {/**********************************-USERNAME, DOMAIN & PDF-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small required">username</label>
                    <form>
                        <input type="text" className="form-control nfs-width"
                               autoFocus={true}
                               placeholder="username (e.g. name@email.co.uk)"
                               value={specific_json.username}
                               onChange={(event) => {
                                   setData({username: event.target.value})
                               }}
                               required
                        />
                    </form>
                </div>
                <div className="form-group col-4">
                    <label className="small required">domain</label>
                    <form>
                        <input type="text" className="form-control nfs-width"
                               placeholder="domain"
                               value={specific_json.domain}
                               onChange={(event) => {
                                   setData({domain: event.target.value})
                               }}
                               required
                        />
                    </form>
                </div>
                <div className="col-2 offset-1">
                    <a href="resources/simsage-jira-crawler-setup.pdf" id="dlGDrive" target="_blank"
                       title="Download the SimSage Confluence setup guide" className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>Egnyte <br/>Setup Guide
                    </a>
                </div>
            </div>
            {/**********************************-PASSWORD & CLIENT ID-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-6">
                    <label className={`small ${Api.hasSourceId(selected_source) ? '' : 'required'}`}>
                        password
                    </label>
                    <span className="fst-italic fw-light small">
                        {Api.hasSourceId(selected_source) ? ' (leave blank to keep previous)' : ''}
                    </span>
                    <form>
                        <input type="password" className="form-control nfs-width"
                               placeholder=""
                               value={specific_json.password}
                               onChange={(event) => {
                                   setData({password: event.target.value})
                               }}
                               required
                        />
                    </form>
                </div>
                <div className="form-group col-2">
                    <label className="small required">client ID</label>
                    <form>
                        <input type="text" className="form-control nfs-width"
                               placeholder="client ID"
                               value={specific_json.client_id}
                               onChange={(event) => {
                                   setData({client_id: event.target.value})
                               }}
                               required
                        />
                    </form>
                </div>
            </div>
            {/**********************************-CLIENT SECRET, GRANT TYPE & PATH-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-6">
                    <label className={`small ${Api.hasSourceId(selected_source) ? '' : 'required'}`}>
                        client secret
                    </label>
                    <span className="fst-italic fw-light small">
                        {Api.hasSourceId(selected_source) ? ' (leave blank to keep previous)' : ''}
                    </span>
                    <form>
                        <input type="password" className="form-control nfs-width"
                               placeholder=""
                               value={specific_json.client_secret}
                               onChange={(event) => {
                                   setData({client_secret: event.target.value})
                               }}
                               required
                        />
                    </form>
                </div>
                <div className="form-group col-2">
                    <label className="small required">grant type</label>
                    <form>
                        <input type="text" className="form-control nfs-width"
                               placeholder="grant type"
                               value={specific_json.grant_type}
                               onChange={(event) => {
                                   setData({grant_type: event.target.value})
                               }}
                               required
                        />
                    </form>
                </div>
                <div className="form-group col-2">
                    <label className="small required">root path</label>
                    <form>
                        <input type="text" className="form-control nfs-width"
                               placeholder="root path"
                               value={specific_json.root_path}
                               onChange={(event) => {
                                   setData({root_path: event.target.value})
                               }}
                               required
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}
