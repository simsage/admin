import React, { useEffect, useState } from "react";
import { BsFilePdf } from "react-icons/bs";
import SensitiveCredential from "../../../components/SensitiveCredential";
import { DOCUMENTATION, useSelectedSource } from './common.js';

export default function CrawlerOpenTextForm(props) {

    const [initialized, setInitialized] = useState(false)

    const {
        selected_source,
        source_saved,
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props)

    function setData(data) {
        setSpecificJson({ ...specific_json, ...data })
    }

    // Initialize
    useEffect(() => {
        if (!initialized) {
            setInitialized(true)
        }
    }, [initialized])

    // Save specific_json to form data whenever it changes
    useEffect(() => {
        let specific_json_stringify = JSON.stringify({ ...specific_json })
        props.setFormData({ ...l_form_data, specificJson: specific_json_stringify })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])

    // This crawler doesn't need the verify system
    useEffect(() => {

        const validate_open_text = () => {
            const {server, username} = specific_json
            let missing = []

            if ((username ?? "").length < 2)
                missing.push("username name missing")

            if ((server ?? "").length < 4)
                missing.push("Open-text server name missing")

            if (server.indexOf("https://") !== 0 && server.indexOf("http://") !== 0)
                missing.push("Open-text server name must start with http:// or https://")
            if (server.indexOf("/ContentManager") < 0)
                missing.push("Open-text server name must end with /ContentManager")

            return (missing.length > 0) ? `OpenText Crawler: please provide the ${missing.join(", ")}` : null
        }

        if (props.set_verify) {
            props.set_verify(() => validate_open_text)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.set_verify])

    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            {/**********************************-USERNAME, DOMAIN & PDF-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-3">
                    <label className="small required">Username</label>
                    <input type="text" className="form-control nfs-width"
                           autoFocus={true}
                           placeholder="username (e.g. name@email.co.uk)"
                           value={specific_json.username || ""}
                           onChange={(event) => {
                               setData({ username: event.target.value })
                           }}
                           required
                    />
                </div>
                <div className="form-group col-5">
                    <label className="small required">Server</label>
                    <input type="text" className="form-control nfs-width"
                           placeholder="server, e.g. https://text.opentext.com/ContentManager"
                           value={specific_json.server || ""}
                           onChange={(event) => {
                               setData({ server: event.target.value })
                           }}
                           required
                    />
                </div>
                <div className="col-2 offset-1">
                    <a href={DOCUMENTATION.OPENTEXT} id="dlOpenText" target="_blank" rel="noreferrer"
                       title="Download the SimSage Open-Text Content Manager setup guide"
                       className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>Open Text <br/>Setup Guide
                    </a>
                </div>
            </div>

            {/**********************************-PASSWORD-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-4">
                    <SensitiveCredential
                        selected_source={selected_source}
                        specific_json={specific_json.password || ""}
                        onChange={(event) => {
                            setData({ password: event.target.value })
                        }}
                        name="Password"
                        required={!source_saved}
                    />
                </div>
                <div className="form-group col-2">
                    <label className="small">Domain (optional)</label>
                    <input type="text" className="form-control nfs-width"
                           placeholder="E.g., MYDOMAIN"
                           value={specific_json.domain || ""}
                           onChange={(event) => {
                               setData({ domain: event.target.value })
                           }}
                    />
                </div>
            </div>
        </div>
    )
}
