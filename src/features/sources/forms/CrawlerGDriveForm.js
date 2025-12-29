import Api from "../../../common/api";
import React, {useEffect, useState} from "react";
import {BsFilePdf, BsFillFolderSymlinkFill, BsFillPersonFill} from 'react-icons/bs'
import {GoogleDrivesAndFolders} from "./Google/GoogleDrivesAndFolders.js";
import {useDispatch, useSelector} from "react-redux";
import {getSessionId} from "../../auth/authSlice";
import {DOCUMENTATION, invalid_credential, useSelectedSource} from './common.js';
import {synchronizeGroups} from "../sourceSlice";
import ErrorMessage from "../../../common/ErrorMessage";
import ResetDeltaControl from "../../../common/ResetDeltaControl";


export default function CrawlerGDriveForm(props) {

    const dispatch = useDispatch();

    // Fetch selected source and calculate source_saved using custom hook
    const {
        selected_source,
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props);

    const theme = useSelector((state) => state.homeReducer.theme);

    // for editing a drive item (undefined if not editing)
    const [current_drive_details, setCurrentDriveDetails] = useState(undefined)
    // the index of this item if it exists, otherwise -1 for a new item
    const [current_drive_index, setCurrentDriveIndex] = useState(-1)
    // for ErrorMessage, type: {code: "title", message: "message"}
    const [error, setError] = useState(undefined)

    const [syncSuccess, setSyncSuccess] = useState(false);

    const sessionId = useSelector(getSessionId)

    const canSynchronize = (props.source && props.source.sourceId && props.source.sourceId !== "0") &&
        Api.definedAndNotBlank(specific_json.customer_id) &&
        Api.definedAndNotBlank(specific_json.service_user)

    const syncMessage = canSynchronize ? "Synchronize Group memberships" :
        "Please set Service User, Customer Id, Json Token values\nand save source before synchronizing Group memberships"

    const created = selected_source.sourceId > 0

    // Update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({...specific_json, ...data})
    }

    // Update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson: specific_json_stringify})

        const validate_google_drive = () => {
            const {json_key_file, service_user} = specific_json
            let missing = []

            if (props.source && invalid_credential(json_key_file) && props.source.sourceId === "0")
                missing.push("json_key_file")

            if (props.source && invalid_credential(service_user))
                missing.push("service_user")

            if (getDrives().length === 0)
                missing.push("Google drive(s)")

            return (missing.length > 0) ? `Google Drive Crawler: please provide the ${missing.join(", ")}` : null
        }

        props.set_verify(() => validate_google_drive)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])

    const closeEditForm = (e) => {
        setCurrentDriveDetails(undefined)
        e.preventDefault()
    }

    // add a new, or edit an existing drive value callback
    const setDriveValue = (driveValue) => {
        const curAllDrives = specific_json.allDrives ? specific_json.allDrives : []

        // first make sure we're allowed to add it - it can't be a duplicate item of
        // a drive already there for either: driveEmail: "", driveId: ""
        if (current_drive_index === -1) {
            const existingUserDrive = curAllDrives
                .filter(drive =>
                    drive.driveEmail.length > 0 && driveValue.driveEmail.length > 0 &&
                    drive.driveEmail.toLowerCase() === driveValue.driveEmail.toLowerCase())
            const existingDriveId = curAllDrives
                .filter(drive =>
                    drive.driveId.length > 0 && driveValue.driveId.length > 0 &&
                    drive.driveId.toLowerCase() === driveValue.driveId.toLowerCase())

            // duplicate user drive?
            if (existingUserDrive.length > 0) {
                setError({
                    code: "Cannot add User Drive",
                    message: "A User Drive \"" + driveValue.driveEmail + "\" already exists"
                })
                return
            }
            // duplicate drive ID?
            if (existingDriveId.length > 0) {
                setError({
                    code: "Cannot add Drive ID",
                    message: "A Drive with ID \"" + driveValue.driveId + "\" already exists"
                })
                return
            }
        }

        if (current_drive_index === -1) { // new item?
            curAllDrives.push(driveValue)

        } else if (current_drive_index < curAllDrives.length) {
            curAllDrives[current_drive_index] = driveValue
        }
        setData({allDrives: curAllDrives})
        setCurrentDriveDetails(undefined)
    }

    const editDrive = (index) => {
        const curAllDrives = specific_json.allDrives ? specific_json.allDrives : []
        setCurrentDriveIndex(index)
        setCurrentDriveDetails(curAllDrives[index])
    }

    const removeDrive = (index) => {
        const curAllDrives = specific_json.allDrives ? specific_json.allDrives : []
        curAllDrives.splice(index, 1)
        setData({allDrives: curAllDrives})
    }

    // access the drive list
    const getDrives = () => { return specific_json.allDrives || [] }

    const sync = (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (props.source) {
            dispatch(synchronizeGroups({
                session_id: sessionId,
                organisation_id: props.source.organisationId,
                kb_id: props.source.kbId,
                source_id: props.source.sourceId,
                on_success: () => setSyncSuccess(true)
            }))
        }

    }

    const emailOrDriveIdValue = (drive) => drive ? (drive.driveId ? drive.driveId : drive.driveEmail) : ""

    // helper: render a single row of the Drive List
    const renderFolders = (drive) => {
        // If the mode is 'all', return a specific string
        if (drive?.mode === "all") {
            return "Crawl Everything"
        }
        let folders = ""
        if (drive?.mode === "include") {
            folders = drive.folderCsv || ""
        } else if (drive?.mode === "exclude") {
            folders = drive.folderExcludeCsv || ""
        }
        // Split folders by comma and map to a list of elements
        const folder_list = folders.split(",")
            .map(folder => folder.trim())
            .filter(folder => folder !== "")

        const detail = drive.mode === "include" ? "included" : "excluded"
        return (
            <span title={drive.mode === "include" ? "Folders included" : "Folders excluded"}>
                { folder_list.length === 1 ? ("one folder " + detail) : ("" + folder_list.length + " folders " + detail)}
            </span>
        )
    }

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById("jsonTextarea").value = e.target.result;
        };
        reader.readAsText(file);
    }

    const handleDragOver = (event) => event.preventDefault()
    const closeSyncDialog = () => setSyncSuccess(false)

    return (
        <div className="tab-content m-10 px-5 py-4 overflow-auto">

            <ErrorMessage error={error} close={() => setError(undefined)}/>

            {current_drive_details &&
                <GoogleDrivesAndFolders handleClosed={closeEditForm}
                                        sourceCreated={created}
                                        driveIndex={current_drive_index}
                                        driveDetails={current_drive_details}
                                        setDriveValue={setDriveValue} />
            }

            <div className="row mb-4">
                <div className="col-9">
                    <div className="row mb-4">
                        <div className="form-group col-12">
                            <label className="small required">
                                JSON key contents
                            </label>
                            <div style={{position: "relative"}}
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
                                       required
                                />
                            </div>
                            <div className="form-group col-2">
                                {syncSuccess && // SM-1117
                                    <div className="modal" tabIndex="-1" role="dialog"
                                         style={{display: "inline", zIndex: 1061}}>
                                        <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                                            <div
                                                className="modal-content shadow p-3 mb-5rounded">

                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="staticBackdropLabel"
                                                        title="Groups Synced Successfully">
                                                        Group Synchronization Started
                                                    </h5>
                                                    <button onClick={closeSyncDialog} type="button"
                                                            className="btn-close"
                                                            data-bs-dismiss="modal" title="close this prompt"
                                                            aria-label="Close">
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="control-row">
                                                        <span title="SimSage has started to sync Google Groups"
                                                              className="label-wide">
                                                            SimSage has started to sync Google Groups,
                                                            this can take a few minutes.  Please be patient.
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button onClick={closeSyncDialog} type="button"
                                                            title="close this prompt"
                                                            className="btn btn-primary">Close
                                                    </button>
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
                            <div className={(theme==="light" ? "text-black-50" : "text-white-50") + " col-4 small px-4"}>
                                User / Shared Drive Id
                            </div>
                            <div className={(theme==="light" ? "text-black-50" : "text-white-50") + " col-6 small"}>Folders</div>
                            <div className={(theme==="light" ? "text-black-50" : "text-white-50") + " col-2 small"}>
                                <button className="btn text-primary btn-sm fw-500"
                                        onClick={(e) => {
                                            setCurrentDriveIndex(-1)
                                            setCurrentDriveDetails({
                                                driveEmail: "",
                                                driveId: "",
                                                folderCsv: "",
                                                folderExcludeCsv: "",
                                                isExclusive: false,
                                                crawlRootFiles: false,
                                                crawlShortcuts: false,
                                                mode: "all"
                                            })
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                >+ Add Drive
                                </button>
                            </div>
                        </div>
                        <div className={"gdrive-drives-scroll-section"}>
                            {getDrives().map((drive, index) => (
                                <div key={index} className={"drive_row col-12"}>
                                    <div className={"col-4"}>
                                        {drive && drive.driveId && <BsFillFolderSymlinkFill size={16}/>}
                                        {drive && !drive.driveId && <BsFillPersonFill size={16}/>}
                                        <div>&nbsp;&nbsp;{emailOrDriveIdValue(drive)}</div>
                                    </div>
                                    <div className={"col-6"}>
                                        {renderFolders(drive)}
                                    </div>
                                    <div className={"col-2"}>
                                        <div title={specific_json.sites_only ? "Disable 'sites only' to edit" : ""}>
                                            <button
                                                disabled={specific_json.sites_only}
                                                className="btn text-primary btn-sm border-0"
                                                onClick={(e) => {
                                                    editDrive(index);
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                }}
                                            >Edit
                                            </button>
                                        </div>
                                        <button className="btn text-primary btn-sm" onClick={(e) => {
                                            removeDrive(index);
                                            e.stopPropagation();
                                            e.preventDefault();
                                        }}>Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    <ResetDeltaControl />

                </div>
                <div className="col-2 offset-1">
                    <a href={DOCUMENTATION.GOOGLE_DRIVE} id="dlGDrive" target="_blank" rel="noreferrer"
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