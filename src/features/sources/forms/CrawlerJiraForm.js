import React, {useEffect, useState} from "react";
import Api from "../../../common/api";
import {BsFilePdf} from "react-icons/bs";
import SensitiveCredential from "../../../components/SensitiveCredential";

export default function CrawlerJiraForm(props) {

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
            {/**********************************-USERNAME, BASE-URL & PDF-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small required">username</label>
                    <form>
                        <input type="email" className="form-control nfs-width"
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
                    <label className="small required">base url</label>
                    <form>
                        <input type="text" className="form-control nfs-width"
                               placeholder="base url (e.g. https://simsage.atlassian.net)"
                               value={specific_json.jira_base_url}
                               onChange={(event) => {
                                   setData({jira_base_url: event.target.value})
                               }}
                               required
                        />
                    </form>
                </div>
                <div className="col-2 offset-1">
                    <a href="resources/simsage-jira-crawler-setup.pdf" id="dlGDrive" target="_blank"
                       title="Download the SimSage Confluence setup guide" className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>Jira <br/>Setup Guide
                    </a>
                </div>
            </div>
            {/**********************************-API TOKEN & BOARD KEY-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-6">
                    <SensitiveCredential
                        selected_source={selected_source}
                        specific_json={specific_json.api_token}
                        onChange={(event) => {
                            setData({api_token: event.target.value})
                        }}
                        name="API Token"
                    />
                </div>
                <div className="form-group col-2">
                    <label className="small required">board key</label>
                    <form>
                        <input type="text" className="form-control nfs-width"
                               placeholder="board key (e.g. SM, BR, SIM)"
                               value={specific_json.board_key}
                               onChange={(event) => {
                                   setData({board_key: event.target.value})
                               }}
                               required
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}
