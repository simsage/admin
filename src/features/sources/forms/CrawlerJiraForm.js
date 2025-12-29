import React, {useEffect} from "react";
import {BsFilePdf} from "react-icons/bs";
import SensitiveCredential from "../../../components/SensitiveCredential";
import {DOCUMENTATION, useSelectedSource} from './common.js';


export default function CrawlerJiraForm(props) {

    // Fetch selected-source and calculate source_saved using custom-hook
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

    // verify Jira parameters before save
    useEffect(() => {

        const validate_jira = () => {
            const {username, jira_base_url, board_key} = specific_json
            let missing = []
            if (!username || username.trim().length === 0)
                missing.push("username")
            if (!jira_base_url || jira_base_url.trim().length === 0)
                missing.push("jira_base_url")
            if (!board_key || board_key.trim().length === 0)
                missing.push("board_key")
            if (missing.length > 0)
                return `Jira Crawler: please provide the ${missing.join(", ")}`
            const lwr_jira_base_url = jira_base_url.toLowerCase()
            if (lwr_jira_base_url.indexOf("atlassian.net") >= 0)
                return "Jira Crawler: please provide the base url without the 'atlassian.net' part"
            if (lwr_jira_base_url.indexOf("https://") >= 0 || lwr_jira_base_url.indexOf("http://") >= 0)
                return "Jira Crawler: please provide the base url without the 'http' part"
            return null
        }

        if (props.set_verify) props.set_verify(() => validate_jira)
    }, [props, specific_json])

    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            {/**********************************-USERNAME, BASE-URL, BOARD KEY & PDF-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-3">
                    <label className="small required">username</label>
                    <input type="email" className="form-control nfs-width"
                           autoFocus={true}
                           placeholder="username (e.g. name@email.co.uk)"
                           title="the username is the email address of the user that created the API token"
                           value={specific_json.username}
                           onChange={(event) => {
                               setData({username: event.target.value})
                           }}
                           required
                    />
                </div>
                <div className="form-group col-3">
                    <label className="small required">customer name</label>
                    <input type="text" className="form-control nfs-width"
                           placeholder="(e.g., simsage for https://simsage.atlassian.net)"
                           title="customer name (e.g., simsage for https://simsage.atlassian.net)"
                           value={specific_json.jira_base_url}
                           onChange={(event) => {
                               setData({jira_base_url: event.target.value})
                           }}
                           required
                    />
                </div>
                <div className="form-group col-3">
                    <label className="small required">board key csv list</label>
                    <input type="text" className="form-control nfs-width"
                           placeholder="board key csv list (e.g. SM, BR, SIM)"
                           title="board key csv list (e.g. SM, BR, SIM)"
                           value={specific_json.board_key}
                           onChange={(event) => {
                               setData({board_key: event.target.value})
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
            {/**********************************-API TOKEN-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-12">
                    <SensitiveCredential
                        selected_source={selected_source}
                        specific_json={specific_json.api_token}
                        placeholder={"to create a new token visit:  https://id.atlassian.com/manage-profile/security/api-tokens"}
                        onChange={(event) => {
                            setData({api_token: event.target.value})
                        }}
                        name="API Token"
                        required={!source_saved}
                    />
                </div>
            </div>
        </div>
    )
}
