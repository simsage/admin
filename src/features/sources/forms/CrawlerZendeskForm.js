import React, {useEffect} from "react";
import {BsFilePdf} from "react-icons/bs";
import SensitiveCredential from "../../../components/SensitiveCredential";
import { DOCUMENTATION, useSelectedSource } from './common.js';
export default function CrawlerZendeskForm(props) {

    // Fetch selected source and calculate source_saved using custom hook
    const {
        selected_source,
        source_saved,
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props);

    function setData(data) {
        setSpecificJson({ ...specific_json, ...data });
    }

    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({ ...l_form_data, specificJson: specific_json_stringify });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json]);

    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            {/**********************************-USERNAME, DOMAIN & PDF-**********************************/}
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
                               value={specific_json.domain}
                               onChange={(event) => {
                                   setData({domain: event.target.value})
                               }}
                               required
                        />
                    </form>
                </div>
                <div className="col-2 offset-1">
                    <a href={DOCUMENTATION.ZENDESK} id="dlGDrive" target="_blank"
                       title="Download the SimSage Zendesk setup guide" className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>Zendesk<br/>Setup Guide
                    </a>
                </div>
            </div>
            {/**********************************-PASSWORD-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-6">
                    <SensitiveCredential
                        selected_source={selected_source}
                        specific_json={specific_json.password}
                        onChange={(event) => {
                            setData({password: event.target.value})
                        }}
                        name="API Token"
                        required={!source_saved}
                    />
                </div>
            </div>
        </div>
    )
}
