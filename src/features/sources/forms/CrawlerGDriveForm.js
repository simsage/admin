import Api from "../../../common/api";
import React, {useEffect, useRef, useState} from "react";
import {BsFilePdf, BsFillFolderSymlinkFill, BsFillPersonFill} from 'react-icons/bs'
import {GoogleDrivesAndFolders} from "./GoogleDrivesAndFolders";
import {useSelector} from "react-redux";
import {getSessionId} from "../../auth/authSlice";
import axios from "axios/index";
import { DOCUMENTATION, useSelectedSource } from './common.js';


export default function CrawlerGDriveForm(props) {

    // Fetch selected source and calculate source_saved using custom hook
    const {
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props);

    const [editDriveDetails, setEditDriveDetails] = useState(false)
    const [currentDriveDetails, setCurrentDriveDetails] = useState({})
    const [currentDriveRow, setCurrentDriveRow] = useState(-1)

    const [synchronizing, setSynchronizing] = useState(false)
    const [syncSuccess, setSyncSuccess] = useState(false);

    const sessionId = useSelector(getSessionId)


    const canSynchronize = !synchronizing &&
        (props.source.sourceId && props.source.sourceId !== "0") &&
        Api.definedAndNotBlank(specific_json.customer_id) &&
        Api.definedAndNotBlank(specific_json.service_user) &&
        !Api.definedAndNotBlank(specific_json.json_key_file) // if json is set afresh we need a save first

    const syncMessage = canSynchronize ? "Synchronize Group memberships"
        : synchronizing ? "Currently Synchronizing"
            : "Please set Service User" + ", Customer Id, Json Token values\nand save source before synchronizing Group memberships"


    //update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({...specific_json, ...data})
    }


    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson: specific_json_stringify})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])

    const closeEditForm = (e) => {
        setEditDriveDetails(false)
        e.preventDefault()
    }

    const setDriveValue = (driveValue) => {
        const curAllDrives = specific_json.allDrives ? specific_json.allDrives : []
        if (currentDriveRow === -1) {
            curAllDrives.push(driveValue)
        } else {
            curAllDrives[currentDriveRow] = driveValue
        }
        setData({allDrives: curAllDrives})

        setEditDriveDetails(false)
    }

    const editDrive = (index) => {
        const curAllDrives = specific_json.allDrives ? specific_json.allDrives : []
        setCurrentDriveRow(index)
        setCurrentDriveDetails(curAllDrives[index])
        setEditDriveDetails(true)
    }

    const removeDrive = (index) => {
        const curAllDrives = specific_json.allDrives ? specific_json.allDrives : []
        curAllDrives.splice(index, 1)
        setData({allDrives: curAllDrives})
    }

    const getDrives = () => {
        if (specific_json && specific_json.allDrives) {
            return specific_json.allDrives
        } else return []
    }

    const sync = (e) => {
        e.preventDefault()
        e.stopPropagation()

        setSynchronizing(true)
        const axiosParams = {
            url: window.ENV.api_base + "/crawler/syncgdrivegroups",
            method: "POST",
            data: {
                organisationId: props.source.organisationId,
                kbId: props.source.kbId,
                sourceId: props.source.sourceId
            },
            headers: {
                accept: '*/*',
                "session-id": sessionId
            }
        }

        axios.request(axiosParams).then(_ => {
            setSynchronizing(false);
            setSyncSuccess(true);
        })

    }

    const emailOrDriveIdValue = (drive) => {
        if (drive) {
            return drive.driveId ? drive.driveId : drive.driveEmail
        } else {
            return ""
        }
    }

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById("jsonTextarea").value = e.target.result;
        };
        reader.readAsText(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };


    const modalRef = useRef();

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeSyncDialog();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const closeSyncDialog = () => {
        setSyncSuccess(false);
    };

    return (
        <div className="tab-content m-10 px-5 py-4 overflow-auto">

            {editDriveDetails &&
                <GoogleDrivesAndFolders handleClosed={closeEditForm} driveDetails={currentDriveDetails}
                                        setDriveValue={setDriveValue}/>}

            <div className="row mb-4">
                <div className="col-9">
                    <div className="row mb-4">
                        <div className="form-group col-12">
                            <label className="small required">
                                JSON key contents
                            </label>
                            <div style={{ position: "relative" }}
                                 onDrop={handleDrop}
                                 onDragOver={handleDragOver}>
                                <textarea className="form-control"
                                          id="jsonTextarea"
                                          placeholder="The Google JSON key identifying the service account to use to access and impersonate user-drive data. Leave empty if you've already set this value previously and don't want to change it. Otherwise you can drag/drop."
                                          rows={5}
                                          value={specific_json.json_key_file}
                                          onChange={(event) => {
                                              setData({json_key_file: event.target.value})
                                          }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="row mb-4">
                            <div className="form-group col-5">
                                <label className="small required">Service User</label>
                                <input type="text" className="form-control"
                                       placeholder="Administrative user"
                                       autoFocus={true}
                                       value={specific_json.service_user}
                                       onChange={(event) => {
                                           setData({service_user: event.target.value})
                                       }}
                                />
                            </div>
                            <div className="form-group col-5">
                                <label className="small required">Customer Id</label>
                                <input type="text" className="form-control"
                                       placeholder="Google Customer Id"
                                       autoFocus={true}
                                       value={specific_json.customer_id}
                                       onChange={(event) => {
                                           setData({customer_id: event.target.value})
                                       }}
                                />
                            </div>
                            <div className="form-group col-2">
                                {syncSuccess && // SM-1117
                                    <div className="modal"  tabIndex="-1" role="dialog" style={{display: "inline", zIndex: 1061}}>
                                        <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                                            <div ref={modalRef} className="modal-content shadow p-3 mb-5 bg-white rounded">

                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="staticBackdropLabel"
                                                        title="Groups Synced Successfully">
                                                        Groups Successfully Synchronised
                                                    </h5>
                                                    <button onClick={closeSyncDialog} type="button" className="btn-close"
                                                            data-bs-dismiss="modal" title="close this prompt"
                                                            aria-label="Close">
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="control-row">
                                                        <span title="SimSage was able to sync Google Groups"
                                                              className="label-wide">
                                                            SimSage was able to sync Google Groups
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button onClick={closeSyncDialog} type="button"
                                                            title="close this prompt"
                                                            className="btn btn-primary">Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <button className={"btn btn-primary px-4 pe-auto"}
                                        disabled={!canSynchronize}
                                        title={syncMessage}
                                        onClick={(e) => sync(e)}>
                                    Synchronize Groups
                                </button>
                            </div>

                        </div>
                    </div>


                    <div className="row mb-4">
                        <div className="form-group col-12">
                            <label className="small d-flex justify-content-between">
                                <span className={"required"}>Drive List</span>
                            </label>
                        </div>
                        <div className={"drive_row col-12"}>
                            <div className={"col-4 small text-black-50 px-4"}>
                                User / Shared Drive Id
                            </div>
                            <div className={"col-6 small text-black-50"}>Folders</div>
                            <div className={"col-2 small text-black-50"}>
                                <button className="btn text-primary btn-sm fw-500"
                                        onClick={(e) => {
                                            setCurrentDriveRow(-1)
                                            setCurrentDriveDetails({
                                                driveEmail: "",
                                                driveId: "",
                                                folderCsv: ""
                                            })
                                            setEditDriveDetails(true)
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                >+ Add Drive
                                </button>
                            </div>
                        </div>
                        <div className={"gdrive-drives-scroll-section"}>
                            {getDrives().map((drive, index) => {
                                return <div className={"drive_row col-12"}>
                                    <div className={"col-4"}>
                                        {drive && drive.driveId && <BsFillFolderSymlinkFill size={16}/>}
                                        {drive && !drive.driveId && <BsFillPersonFill size={16}/>}
                                        <div>&nbsp;&nbsp;{emailOrDriveIdValue(drive)}</div>
                                    </div>
                                    <div className={"col-6"}>{drive && drive.folderCsv}</div>
                                    <div className={"col-2"}>
                                        <button className="btn text-primary btn-sm" onClick={(e) => {
                                            editDrive(index);
                                            e.stopPropagation()
                                            e.preventDefault()
                                        }}>Edit
                                        </button>
                                        <button className="btn text-primary btn-sm" onClick={(e) => {
                                            removeDrive(index);
                                            e.stopPropagation()
                                            e.preventDefault()
                                        }}>Remove
                                        </button>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>


                    <div className="row mb-4">
                        <div className="col-6">
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox"
                                       checked={specific_json.sites_only}
                                       onChange={(event) => {
                                           setData({sites_only: event.target.checked});
                                       }}
                                       title="Crawl only Google site data from these Drives"/>
                                <label className="form-check-label small">Crawl only Google site
                                    data from these Drives</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-2 offset-1">
                    <a href={DOCUMENTATION.GOOGLE_DRIVE} id="dlGDrive" target="_blank"
                       title="Download the SimSage Google Drive setup guide"
                       className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>Google Drive <br/>Setup Guide
                    </a>
                </div>
            </div>

        </div>
    );

}