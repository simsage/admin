import React, { useEffect, useState } from "react";
import { BsFilePdf } from "react-icons/bs";
import SensitiveCredential from "../../../components/SensitiveCredential";
import { DOCUMENTATION, useSelectedSource } from './common.js';
import CustomSelect from "../../../components/CustomSelect";
import FolderTagsInput from "./Google/FolderTagsInput";

export default function CrawlerEgnyteForm(props) {

    const [initialized, setInitialized] = useState(false)
    const [mode, setMode] = useState('all')
    const [folderList, setFolderList] = useState("")

    const modes = [
        { "key": "all", "value": "Crawl Everything" },
        { "key": "include", "value": "Include Folders..." },
        { "key": "exclude", "value": "Exclude Folders..." }
    ]

    const {
        selected_source,
        source_saved,
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props)

    function handleModeChange(key) {
        setMode(key)
    }

    function setData(data) {
        setSpecificJson({ ...specific_json, ...data, mode })
    }

    // Initialize mode and folderList from specific_json or set default
    useEffect(() => {
        if (!initialized) {
            setInitialized(true)
            const savedMode = specific_json.mode || 'all'
            const savedFolderList = specific_json.folderList || ""
            setMode(savedMode)
            setFolderList(savedFolderList)

            // Guarantee that mode is saved in specific_json if it was missing
            if (!specific_json.mode) {
                setSpecificJson({ ...specific_json, mode: savedMode })
            }
        }
    }, [initialized, specific_json, setSpecificJson])

    // Update specific_json whenever mode changes
    useEffect(() => {
        setData({ mode })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode])

    // Save specific_json to form data whenever it changes
    useEffect(() => {
        let specific_json_stringify = JSON.stringify({ ...specific_json })
        props.setFormData({ ...l_form_data, specificJson: specific_json_stringify })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])

    // This crawler doesn't need the verify system
    useEffect(() => {
        if (props.set_verify) {
            props.set_verify('n/a')
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
                <div className="form-group col-3">
                    <label className="small required">Client ID</label>
                    <input type="text" className="form-control nfs-width"
                           placeholder="client ID"
                           value={specific_json.client_id || ""}
                           onChange={(event) => {
                               setData({ client_id: event.target.value })
                           }}
                           required
                    />
                </div>
                <div className="form-group col-2">
                    <label className="small required">Domain</label>
                    <input type="text" className="form-control nfs-width"
                           placeholder="E.g., app4simsage (exclude https:// & egnyte.com)"
                           value={specific_json.domain || ""}
                           onChange={(event) => {
                               setData({ domain: event.target.value })
                           }}
                           required
                    />
                </div>
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
                <div className="form-group col-4">
                    <SensitiveCredential
                        selected_source={selected_source}
                        specific_json={specific_json.client_secret || ""}
                        onChange={(event) => {
                            setData({ client_secret: event.target.value })
                        }}
                        name="Client Secret"
                        required={!source_saved}
                    />
                </div>
            </div>
            {/**********************************-CLIENT SECRET-**********************************/}
            <div className="row border-top pt-4">
                <div className="row mb-4">
                    <div className="form-group col-3">
                        <label className="label-left small">Crawl Mode</label>
                        <CustomSelect
                            defaultValue={mode}
                            disabled={false}
                            value={mode}
                            onChange={(key) => handleModeChange(key)}
                            options={modes}
                        />
                    </div>
                </div>
                <div className="row mb-4">
                    {mode !== "all" &&
                        <div className="form-group col-12">
                            <FolderTagsInput
                                value={folderList}
                                onChange={(newFolderList) => {
                                    setFolderList(newFolderList);
                                    setData({ folderList: newFolderList })
                                }}
                            />
                            <ul className="alert alert-warning small py-2 mt-3 ps-4" role="alert">
                                <li>Each folder name must start with '/'.</li>
                                <li>Be sure to specify the <i>absolute path</i>.</li>
                                <li>
                                    Leaving the textbox <i>empty</i> will mean the source will crawl everything.
                                </li>
                            </ul>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
