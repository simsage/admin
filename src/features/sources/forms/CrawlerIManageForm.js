import React, {useEffect} from "react";
import {BsFilePdf} from 'react-icons/bs'
import SensitiveCredential from "../../../components/SensitiveCredential";
import {DOCUMENTATION, useSelectedSource, validDropBoxFolderList} from './common.js';


export default function CrawlerIManageForm(props) {

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
        setSpecificJson({...specific_json, ...data})
    }

    function resetCursor(e) {
        e.preventDefault();
        setData({cursor: '0'});
    }

    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson: specific_json_stringify})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])


    useEffect(() => {

        const validate_imanage = () => {
            const {folderList} = specific_json
            let missing = []
            if (!validDropBoxFolderList(folderList))
                missing.push("folderList")
            return missing.length > 0 ? `iManage Crawler: please provide the ${missing.join(", ")}` : null
        }

        if (props.set_verify) props.set_verify(() => validate_imanage)

    }, [props, specific_json])

    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-4">
                <div className="col-9">
                    <div className="row mb-4">
                        <div className="form-group col-6">
                            <label className="small required">Server</label>
                            <input type="text" className="form-control"
                                   placeholder="Server FQDN (e.g. imanage.simsage.ai)"
                                   autoFocus={true}
                                   value={specific_json.server}
                                   onChange={(event) => {
                                       setData({server: event.target.value})
                                   }}
                            />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="form-group col-6">
                            <label className="small required">Admin username</label>
                            <input type="text" className="form-control"
                                   placeholder=""
                                   autoFocus={true}
                                   value={specific_json.username}
                                   onChange={(event) => {
                                       setData({username: event.target.value})
                                   }}
                            />
                        </div>
                        <div className="form-group col-6">

                            <SensitiveCredential
                                selected_source={selected_source}
                                specific_json={specific_json.password}
                                onChange={(event) => {
                                    setData({password: event.target.value})
                                }}
                                name="Admin Password"
                                placeholder="**********"
                                required={!source_saved}
                            />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="form-group col-6">
                            <label className="small required">Client ID</label>
                            <input type="text" className="form-control"
                                   placeholder=""
                                   autoFocus={true}
                                   value={specific_json.clientId}
                                   onChange={(event) => {
                                       setData({clientId: event.target.value})
                                   }}
                            />
                        </div>
                        <div className="form-group col-6">
                            <SensitiveCredential
                                selected_source={selected_source}
                                specific_json={specific_json.clientSecret}
                                onChange={(event) => {
                                    setData({clientSecret: event.target.value})
                                }}
                                name="Client Secret"
                                placeholder="**********"
                                required={!source_saved}
                            />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="form-group col-6">
                            <label className="small required">Library ID</label>
                            <input type="text" className="form-control"
                                   placeholder="e.g. Active"
                                   autoFocus={true}
                                   value={specific_json.libraryId}
                                   onChange={(event) => {
                                       setData({libraryId: event.target.value})
                                   }}
                            />
                        </div>
                    </div>
                    <div className="row border-top pt-4 mb-4">
                        <div className="form-group col-6">
                            <label className="small">Event-cursor index to check from</label>
                            <div className="d-flex align-items-center">
                                <input type="text" className="form-control"
                                       placeholder=""
                                       autoFocus={true}
                                       value={specific_json.cursor}
                                       onChange={(event) => {
                                           setData({cursor: event.target.value})
                                       }}
                                />
                                <div className="btn bt-sm btn-primary ms-2" onClick={(e) => resetCursor(e)}>Now</div>
                            </div>
                        </div>
                    </div>
                    <div className="row border-top pt-4">
                        <div className="form-group col-8">
                            <label className="small d-flex justify-content-between">
                                Start folder
                                <span className="fst-italic fw-light small">(separate folders by comma)</span>
                            </label>
                            <input type="text" className="form-control"
                                   placeholder="Leave empty to crawl all folders"
                                   autoFocus={true}
                                   value={specific_json.folderList}
                                   onChange={(event) => {
                                       setData({folderList: event.target.value})
                                   }}
                            />
                            <ul className="alert alert-warning small py-2 mt-3 ps-4" role="alert">
                                <li>Each folder must be part of the root folder and not contain any sub-folders.</li>
                                <li>Each folder name must start with '/'.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-2 offset-1">
                    <a href={DOCUMENTATION.IMANAGE} id="dlIManage" target="_blank" rel="noreferrer"
                       title="Download the SimSage iManage setup guide"
                       className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>iManage <br/>Setup Guide
                    </a>
                </div>
            </div>

        </div>
    )
}