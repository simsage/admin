import CustomSelect from "../../../components/CustomSelect";
import SensitiveCredential from "../../../components/SensitiveCredential";
import React, { useEffect, useState } from "react";
import { DOCUMENTATION, useSelectedSource } from "./common";
import FolderTagsInput from "./Google/FolderTagsInput";
import { BsFilePdf } from "react-icons/bs";
import {useSelector} from "react-redux";
import ResetDeltaControl from "../../../common/ResetDeltaControl";

export default function CrawlerBoxForm(props) {
    const [initialized, setInitialized] = useState(false);
    const [originalMode, setOriginalMode] = useState(undefined);
    const theme = useSelector((state) => state.homeReducer.theme);

    // Fetch selected source and calculate source_saved using custom-hook
    const {
        selected_source,
        source_saved,
        specific_json,
        setSpecificJson,
        l_form_data,
    } = useSelectedSource(props)

    const modes = [
        { key: "all", value: "Crawl Everything" },
        { key: "include", value: "Include Folders..." },
        { key: "exclude", value: "Exclude Folders..." },
    ];

    // has this source been created?
    const create_disabled = selected_source.sourceId > 0 && originalMode === "exclude"
    const create_exclude = selected_source.sourceId > 0

    // Update specific_json with new data
    function setData(data) {
        setSpecificJson((prev) => ({ ...prev, ...data }));
    }

    // Initialize component and set folder list
    useEffect(() => {
        if (!initialized) {
            setInitialized(true);
            const savedMode = specific_json.mode || "all"; // Default to 'all'
            const savedFolderList = specific_json.folderList || ""; // Get folderList from specific_json
            setData({ folderList: savedFolderList }); // Clear folderList in specific_json
            setData({ mode: savedMode, folderList: savedFolderList }); // Save mode and folderList on initialization
            setOriginalMode(savedMode)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialized]);

    // Update form data whenever specific_json changes
    useEffect(() => {
        const specific_json_stringify = JSON.stringify(specific_json);
        props.setFormData({ ...l_form_data, specificJson: specific_json_stringify });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])

    // This crawler doesn't need the verify system
    useEffect(() => {
        if (props.set_verify) {
            props.set_verify("n/a");
        }
    }, [props]);

    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-4">
                <div className="col-9">
                    <div className="row mb-4">
                        <div className="form-group col-6">
                            <label className="small required">Client ID</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder=""
                                autoFocus={true}
                                value={specific_json.clientId}
                                onChange={(event) => {
                                    setData({clientId: event.target.value});
                                }}
                                required
                            />
                        </div>
                        <div className="form-group col-6">
                            <SensitiveCredential
                                selected_source={selected_source}
                                specific_json={specific_json.clientSecret}
                                onChange={(event) => {
                                    setData({clientSecret: event.target.value});
                                }}
                                name="Client secret"
                                required={!source_saved}
                            />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="form-group col-6">
                            <label className="small required">Enterprise ID</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder=""
                                value={specific_json.enterpriseId}
                                onChange={(event) => {
                                    setData({enterpriseId: event.target.value});
                                }}
                                required
                            />
                        </div>
                    </div>
                    <div className="row border-top pt-4">

                        <ul className="alert alert-warning small py-2 mt-3 ps-4" role="alert">
                            <li>"Exclude Folders..." can only be used/set once.</li>
                            <li>"Users to Exclude" can only be set at creation time.</li>
                        </ul>

                        <div className="row mb-4">
                            <div className="form-group col-3">
                                <label className="label-left small">Crawl Mode</label>
                                <CustomSelect
                                    defaultValue={specific_json.mode || "all"}
                                    disabled={create_disabled}
                                    value={specific_json.mode || "all"}
                                    onChange={(key) => {
                                        setData({mode: key});
                                        if (key === "all") {
                                            setData({folderList: ""}); // Clear folderList in specific_json
                                        }
                                    }}
                                    options={modes}
                                />
                            </div>
                        </div>
                        <div className="row mb-4">
                            {specific_json.mode !== "all" && (
                                <div className="form-group col-12">
                                    <FolderTagsInput
                                        disabled={create_disabled}
                                        value={specific_json.folderList ? specific_json.folderList : ''}
                                        onChange={(newFolderList) => {
                                            setData({folderList: newFolderList})
                                        }}
                                    />
                                    {!create_disabled &&
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
                                    }
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="row border-top pt-4">
                        <div className="row mb-4">
                            <label className="small">Users to Include
                                <span className={(theme==="light" ? "text-black-50" : "text-white-50") + " fst-italic"}> (csv, optional)</span>
                            </label>
                            <textarea className="form-control"
                                      placeholder="email addresses of user accounts to include (overrides exclude)"
                                      value={specific_json.includeUserCsv ?? ""}
                                      onChange={(event) => setData({includeUserCsv: event.target.value})}/>
                        </div>
                    </div>

                    <div className="row border-top pt-4">
                        <div className="row mb-4">
                            <label className="small">Users to Exclude
                                <span className={(theme==="light" ? "text-black-50" : "text-white-50") + " fst-italic"}> (csv, optional)</span>
                            </label>
                            <textarea className="form-control"
                                      disabled={create_exclude}
                                      readOnly={(specific_json.includeUserCsv ?? "").length > 0}
                                      placeholder={create_exclude ? "can only be set at creation time." : "email addresses of user accounts to exclude (include must be empty)"}
                                      value={(specific_json.includeUserCsv ?? "").length > 0 ? "" : (specific_json.excludeUserCsv ?? "")}
                                      onChange={(event) => setData({excludeUserCsv: event.target.value})}/>
                        </div>
                    </div>

                    <ResetDeltaControl />

                </div>
                <div className="col-2 offset-1">
                    <a
                        href={DOCUMENTATION.BOX}
                        id="dlBox"
                        target="_blank"
                        rel="noreferrer"
                        title="Download the SimSage Box setup guide"
                        className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2"
                    >
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>Box <br/>Setup Guide
                    </a>
                </div>
            </div>
        </div>
    );
}
