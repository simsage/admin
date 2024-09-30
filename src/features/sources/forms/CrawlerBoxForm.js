import React, { useEffect, useState } from "react";
import { BsFilePdf } from 'react-icons/bs';
import SensitiveCredential from "../../../components/SensitiveCredential";
import { DOCUMENTATION, useSelectedSource } from './common.js';
import CustomSelect from "../../../components/CustomSelect";
import FolderTagsInput from "./Google/FolderTagsInput";

export default function CrawlerBoxForm(props) {

    const [initialized, setInitialized] = useState(false)
    const [mode, setMode] = useState('all')
    const [folderList, setFolderList] = useState("")

    // Fetch selected source and calculate source_saved using custom hook
    const {
        selected_source,
        source_saved,
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props)

    const modes = [
        { "key": "all", "value": "Crawl Everything" },
        { "key": "include", "value": "Include Folders..." },
        { "key": "exclude", "value": "Exclude Folders..." }
    ]

    // Update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({ ...specific_json, ...data })
    }

    // Update mode and save it to specific_json
    function handleModeChange(key) {
        setMode(key)  // Update the local state
        setData({ mode: key })  // Update the specific_json with the new mode
    }

    useEffect(() => {
        if (!initialized) {
            setInitialized(true)
            const savedMode = specific_json.mode || 'all'
            const savedFolderList = specific_json.folderList || ""
            setMode(savedMode)
            setFolderList(savedFolderList)
        }
    }, [initialized, specific_json])

    // Update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({ ...l_form_data, specificJson: specific_json_stringify })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])

    // this crawler doesn't need the verify system
    useEffect(() => {
        if (props.set_verify) {
            props.set_verify('n/a')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.set_verify])

    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-4">
                <div className="col-9">
                    <div className="row mb-4">
                        <div className="form-group col-6">
                            <label className="small required">Client ID</label>
                            <input type="text" className="form-control" placeholder="" autoFocus={true}
                                   value={specific_json.clientId}
                                   onChange={(event) => {
                                       setData({ clientId: event.target.value })
                                   }}
                                   required
                            />
                        </div>
                        <div className="form-group col-6">
                            <SensitiveCredential
                                selected_source={selected_source}
                                specific_json={specific_json.clientSecret}
                                onChange={(event) => {
                                    setData({ clientSecret: event.target.value })
                                }}
                                name="Client secret"
                                required={!source_saved}
                            />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="form-group col-6">
                            <label className="small required">Enterprise ID</label>
                            <input type="text" className="form-control"
                                   placeholder=""
                                   autoFocus={true}
                                   value={specific_json.enterpriseId}
                                   onChange={(event) => {
                                       setData({ enterpriseId: event.target.value })
                                   }}
                                   required
                            />
                        </div>
                    </div>
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
                                            setData({ folderList: newFolderList });
                                        }}
                                    />
                                    <ul className="alert alert-warning small py-2 mt-3 ps-4" role="alert">
                                        <li>Each folder name must start with '/'.</li>
                                        <li>Be sure to specify the <i>absolute path</i>.</li>
                                        <li>
                                            Leaving the textbox <i>empty</i> will mean the source will crawl everything.
                                        </li>
                                        <li>
                                            Account is used to communicate with Box - all user accounts will be crawled.
                                        </li>
                                    </ul>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="col-2 offset-1">
                    <a href={DOCUMENTATION.BOX} id="dlBox" target="_blank" rel="noreferrer"
                       title="Download the SimSage Box setup guide"
                       className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25} />
                        <span className="me-2 mt-2"></span>Box <br />Setup Guide
                    </a>
                </div>
            </div>
        </div>
    )
}
